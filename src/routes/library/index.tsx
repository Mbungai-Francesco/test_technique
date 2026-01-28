import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAppContext } from '@/hooks/useAppContext'
import { getProfile } from '@/api/auth'
import { getAppsByUser } from '@/api/application'

export const Route = createFileRoute('/library/')({
  beforeLoad: async () => {
    try {
      const user = await getProfile()
      console.log(user)
      if (user == null) {
        console.log("it 'worked'")
        return redirect({ to: '/login' })
      }
    } catch (e) {
      console.log('it failed')
      return redirect({ to: '/login' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useAppContext()

  const { isFetched, data: res } = useQuery({
    queryKey: ['applications'],
    queryFn: () => getAppsByUser(id),
  })
  
  return <div>Hello "/library/"</div>
}
