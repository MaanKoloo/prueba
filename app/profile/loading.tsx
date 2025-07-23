export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-200 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-8 w-48 bg-blue-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-64 bg-blue-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-10 w-32 bg-blue-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-blue-200 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-center">
                <div className="w-24 h-24 bg-blue-400 rounded-full mx-auto mb-4 animate-pulse"></div>
                <div className="h-6 w-32 bg-blue-400 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 w-24 bg-blue-400 rounded mx-auto animate-pulse"></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="h-4 w-full bg-blue-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-blue-200 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-blue-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Profile Information Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-blue-200 rounded-lg overflow-hidden">
              <div className="bg-blue-50 p-6">
                <div className="h-6 w-48 bg-blue-200 rounded animate-pulse"></div>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="h-5 w-32 bg-blue-200 rounded animate-pulse"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-blue-200 rounded animate-pulse"></div>
                      <div className="h-8 w-full bg-blue-200 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-16 bg-blue-200 rounded animate-pulse"></div>
                      <div className="h-8 w-full bg-blue-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-blue-200"></div>
                <div className="space-y-4">
                  <div className="h-5 w-40 bg-blue-200 rounded animate-pulse"></div>
                  <div className="h-8 w-full bg-blue-200 rounded animate-pulse"></div>
                </div>
                <div className="h-px bg-blue-200"></div>
                <div className="space-y-4">
                  <div className="h-5 w-36 bg-blue-200 rounded animate-pulse"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-blue-200 rounded animate-pulse"></div>
                      <div className="h-8 w-full bg-blue-200 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-12 bg-blue-200 rounded animate-pulse"></div>
                      <div className="h-8 w-full bg-blue-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information Skeleton */}
        <div className="bg-white border border-blue-200 rounded-lg overflow-hidden">
          <div className="bg-blue-50 p-6">
            <div className="h-6 w-56 bg-blue-200 rounded animate-pulse"></div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-blue-200 rounded animate-pulse"></div>
                <div className="h-5 w-32 bg-blue-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-28 bg-blue-200 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-blue-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-blue-200 rounded animate-pulse"></div>
                <div className="h-5 w-40 bg-blue-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
