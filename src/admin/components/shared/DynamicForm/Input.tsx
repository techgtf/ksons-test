function Input({
    label,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
    label: any;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                {label}
            </label>

            <input
                {...props}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
        </div>
    );
}
export default Input;