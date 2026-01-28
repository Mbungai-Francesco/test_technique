import { createFileRoute, redirect } from '@tanstack/react-router'
import { getProfile } from '@/api/auth';

export const Route = createFileRoute('/library/$applicationId')({
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
  return <div>Hello "/library/$applicationId"!</div>
}
