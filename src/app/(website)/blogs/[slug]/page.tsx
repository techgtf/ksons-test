import { agency } from "@/src/app/fonts";
import BlogDetail from "@/src/website/components/blogs/blogDetailContainer/blogDetail";
import { Metadata } from "next";
import { fetchPageData } from "@/src/website/utils/api";
import { BASE_FRONTEND, SITE_LOGO } from "@/config";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const blog = await fetchPageData(`website/blog/${slug}`);
  if (!blog) {
    return {
      title: "Blog not found",
    };
  }
  return {
    title: blog?.data?.seoTags?.meta_title,
    description: blog?.data?.seoTags?.meta_description,
    keywords: blog?.data?.seoTags?.meta_keywords,
    alternates: {
      canonical: `${BASE_FRONTEND}/blogs/${slug}`,
    },
    openGraph: {
      type: "website",
      url: `${BASE_FRONTEND}/blogs/${slug}`,
      siteName: "KSons Group",
      title: blog?.data?.seoTags?.meta_title,
      description: blog?.data?.seoTags?.meta_description,
      images: [
        {
          url: `${BASE_FRONTEND}${SITE_LOGO}`,
          width: 1200,
          height: 630,
          alt: "KSons Group Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@KSonsGroup",
      creator: "@KSonsGroup",
      title: blog?.data?.seoTags?.meta_title,
      description: blog?.data?.seoTags?.meta_description,
      images: [`${BASE_FRONTEND}${SITE_LOGO}`],
    },
  };
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const blogRes = await fetchPageData(`website/blog/${slug}`);

  const blog = blogRes?.data;

  if (!blog) {
    return (
      <div
        className={`pt-50 pb-30 lg:text-[22px] text-[20px] lg:leading-[30px] leading-[28px] text-center text-[#0f3c78] ${agency.className}`}
      >
        Blog not found
      </div>
    );
  }

  return (
    <section className="bg-white pt-30 pb-20">
      <div className="app-container">
        <BlogDetail blog={blog} />
      </div>
    </section>
  );
};

export default Page;
