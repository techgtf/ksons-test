"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  HiOutlineArrowLeft,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineCollection,
  HiOutlineSearch,
} from "react-icons/hi";
import toast from "react-hot-toast";
import api from "@/src/admin/lib/axios";
import {
  getSectionConfig,
  ADMIN_SECTION_REGISTRY,
} from "@/src/admin/config/adminConfig";
import AdminLoader from "@/src/admin/components/shared/AdminLoader";
import ConfirmModal from "@/src/admin/components/shared/ConfirmModal";

interface SubTypology {
  id: string;
  name: string;
}

interface Mapping {
  id: string;
  subTypologyId: string;
  subTypology: SubTypology;
}

export default function TypologyMappingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.platter as string;
  const id = params.id as string;

  const [assigned, setAssigned] = useState<Mapping[]>([]);
  const [unassigned, setUnassigned] = useState<SubTypology[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typologyName, setTypologyName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [subTypologyToDelete, setSubTypologyToDelete] = useState<string | null>(
    null,
  );

  const config = getSectionConfig(slug);

  const fetchMappingData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch typology details to get the name
      try {
        const typologyRes = await api.get(`${config.endpoint}/${id}`);
        // Handle potential { data: { name: ... } } structure
        const tData = typologyRes.data?.data || typologyRes.data;
        setTypologyName(tData?.name || "");
      } catch (err) {
        console.error("Error fetching typology details:", err);
      }

      // Fetch assigned sub-typologies
      const assignedRes = await api.get(
        `/admin/typologymapping/${id}/subtypes`,
      );
      // Handle both [ ... ] and { data: [ ... ] }
      const aRaw = assignedRes.data;
      const assignedData = Array.isArray(aRaw)
        ? aRaw
        : Array.isArray(aRaw?.data)
          ? aRaw.data
          : Array.isArray(aRaw?.subtypes)
            ? aRaw.subtypes
            : [];
      console.log("Assigned Data:", assignedData);
      setAssigned(assignedData);

      // Fetch unassigned sub-typologies
      const unassignedRes = await api.get(
        `/admin/typologymapping/${id}/unassigned-subtypes`,
      );
      // Handle both [ ... ] and { data: [ ... ] }
      const uRaw = unassignedRes.data;
      const unassignedData = Array.isArray(uRaw)
        ? uRaw
        : Array.isArray(uRaw?.data)
          ? uRaw.data
          : Array.isArray(uRaw?.unassignedSubtypes)
            ? uRaw.unassignedSubtypes
            : [];
      console.log("Unassigned Data:", unassignedData);
      setUnassigned(unassignedData);
    } catch (error: any) {
      console.error("Mapping fetch error:", error);
      toast.error(error.message || "Failed to load mapping data");
    } finally {
      setIsLoading(false);
    }
  }, [id, config.endpoint]);

  useEffect(() => {
    if (slug === "typology") {
      fetchMappingData();
    } else {
      router.push(`/admin/${slug}`);
    }
  }, [slug, id, fetchMappingData, router]);

  const handleAssign = async (subTypologyId: string) => {
    try {
      setIsSubmitting(true);
      await api.post("/admin/typologymapping", {
        typologyId: id,
        subTypologyId,
      });
      toast.success("Sub-typology assigned successfully");
      await fetchMappingData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to assign sub-typology");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnassign = async (subTypologyId: string) => {
    setSubTypologyToDelete(subTypologyId);
    setIsConfirmOpen(true);
  };

  const confirmUnassign = async () => {
    if (!subTypologyToDelete) return;
    try {
      setIsSubmitting(true);
      await api.delete(
        `/admin/typologymapping/${id}/subtypes/${subTypologyToDelete}`,
      );
      toast.success("Sub-typology unassigned successfully");
      await fetchMappingData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to unassign sub-typology");
    } finally {
      setIsSubmitting(false);
      setIsConfirmOpen(false);
      setSubTypologyToDelete(null);
    }
  };

  const filteredUnassigned = Array.isArray(unassigned)
    ? unassigned.filter((sub) =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  if (isLoading) {
    return <AdminLoader />;
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
            >
              <HiOutlineArrowLeft className="text-xl group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Manage Sub-Typologies
              </h1>
              <p className="text-sm text-gray-500">
                Mapping for:{" "}
                <span className="font-semibold text-[#0f3c78]">
                  {typologyName}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Unassigned Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Available Sub-Typologies
              </h2>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                {unassigned.length} Available
              </span>
            </div>

            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search sub-typologies..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#0f3c78] focus:ring-2 focus:ring-blue-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex h-[500px] flex-col gap-3 overflow-y-auto rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
              {filteredUnassigned.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-gray-400">
                  <HiOutlineCollection className="mb-2 text-4xl opacity-20" />
                  <p className="text-sm">No sub-typologies available</p>
                </div>
              ) : (
                filteredUnassigned.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-xl border border-gray-50 bg-gray-50/50 p-3 transition-all hover:bg-white hover:shadow-md group"
                  >
                    <span className="font-medium text-gray-700">
                      {sub.name}
                    </span>
                    <button
                      onClick={() => handleAssign(sub.id)}
                      disabled={isSubmitting}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#0f3c78] shadow-sm transition-all hover:bg-[#0f3c78] hover:text-white disabled:opacity-50"
                      title="Assign"
                    >
                      <HiOutlinePlus />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Assigned Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Current Mappings
              </h2>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                {assigned.length} Mapped
              </span>
            </div>

            <div className="flex h-[560px] flex-col gap-3 overflow-y-auto rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
              {assigned.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-gray-400">
                  <HiOutlineCollection className="mb-2 text-4xl opacity-20" />
                  <p className="text-sm">No sub-typologies mapped yet</p>
                </div>
              ) : (
                assigned.map((map) => (
                  <div
                    key={map.id}
                    className="flex items-center justify-between rounded-xl border border-blue-50 bg-blue-50/30 p-3 transition-all hover:bg-blue-50/50"
                  >
                    <span className="font-medium text-gray-700">
                      {map.subTypology?.name || (map as any).name || "Unknown"}
                    </span>
                    <button
                      onClick={() =>
                        handleUnassign(map.subTypologyId || (map as any).id)
                      }
                      disabled={isSubmitting}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-red-500 shadow-sm transition-all hover:bg-red-500 hover:text-white disabled:opacity-50"
                      title="Remove Mapping"
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmUnassign}
        title="Unassign Sub-Typology?"
        message="This will remove the mapping for this sub-typology."
        confirmText="Unassign"
      />
    </div>
  );
}
