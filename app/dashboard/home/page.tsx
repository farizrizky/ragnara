export default function DashboardHome() {
    return (
        <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Welcome to your Dashboard!
            </h1>
            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                This is the home page of your dashboard. You can customize this area to display relevant information and navigation options for your users.
            </p>
        </div>
    );
}