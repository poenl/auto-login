import { SiteCard } from './components/site-card'

export default function Home() {
  return (
    <div className="p-4 h-full">
      {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div> */}
      {/* <div className="bg-muted/50 h-full rounded-xl" /> */}
      <SiteCard />
    </div>
  )
}
