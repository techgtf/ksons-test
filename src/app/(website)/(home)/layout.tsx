import LoaderProvider from "@/src/website/components/LoaderProvider";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return <>
        <LoaderProvider>
            {children}
        </LoaderProvider>
    </>
}