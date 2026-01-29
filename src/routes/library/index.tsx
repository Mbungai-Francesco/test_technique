import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAppContext } from '@/hooks/useAppContext'
import { getProfile } from '@/api/auth'
import { getAppsByUser } from '@/api/application'
import { Search, Upload } from 'lucide-react'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/library/')({
  beforeLoad: async () => {
    // try {
    //   const user = await getProfile()
    //   console.log(user)
    //   if (user == null) {
    //     console.log("it 'worked'")
    //     return redirect({ to: '/login' })
    //   }
    // } catch (e) {
    //   console.log('it failed')
    //   return redirect({ to: '/login' })
    // }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useAppContext()

  const { isFetched, data: res } = useQuery({
    queryKey: ['applications'],
    queryFn: () => getAppsByUser(id),
  })

  return (
    <div className="p-4">
      <div className="flex items-center justify-end gap-4"> 
        {/* Search Bar */}
        <div className="relative flex z-0 items-center border rounded-md pl-2">
          <div className="flex items-center gap-1 cursor-pointer text-slate-600 hover:text-slate-900">
            <Search className=""/>
          </div>
          <Input
            placeholder="Search"
            className="py-5 z-0 flex w-full border-0 outline-none focus:ring-0 active:outline-0 active:ring-0 focus:outline-none"
          />
        </div>
        <button
          onClick={() => {}}
          className="flex items-center gap-3 p-3 rounded-lg bg-blue-800 hover:bg-blue-800 transition-colors mb-2"
        >
          <Upload size={20} className="text-white" />
          <span className="font-medium text-white">Upload App</span>
        </button>
      </div>
    </div>
  )
}
