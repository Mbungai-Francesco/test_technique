import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/library/$applicationId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/library/$applicationId"!</div>
}
