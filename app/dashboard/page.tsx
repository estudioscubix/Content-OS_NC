import { Eye, Bookmark, TrendingUp, Film } from "lucide-react"
import { MetricCard } from "@/components/shared/MetricCard"
import { ViewsChart } from "@/components/dashboard/ViewsChart"
import { TopContent } from "@/components/dashboard/TopContent"
import { GoalsSectionClient } from "@/components/dashboard/GoalsSectionClient"
import { CountryChart } from "@/components/shared/CountryChart"
import { getIGMedia, getFollowerCount } from "@/lib/instagramClient"
import { getDashboardData } from "@/lib/instagramDashboard"
import { getFollowerDemographics } from "@/lib/instagramDemographics"

// Los datos vienen de la API de Instagram en vivo — renderizar por request,
// no en el build (evita que un token vencido tumbe el deploy).
export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const [media, followerCount, countryData] = await Promise.all([
    getIGMedia(),
    getFollowerCount(),
    getFollowerDemographics(),
  ])
  const { kpis, viewsTimeSeries, topContent, currentMonthReach } = getDashboardData(media)

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <MetricCard
          label="Reach Total"
          value={kpis.total_reach >= 1_000_000
            ? (kpis.total_reach / 1_000_000).toFixed(1) + "M"
            : (kpis.total_reach / 1000).toFixed(0) + "k"}
          icon={<Eye size={13} />}
        />
        <MetricCard
          label="Total Guardados"
          value={(kpis.total_saves / 1000).toFixed(1) + "k"}
          icon={<Bookmark size={13} />}
        />
        <MetricCard
          label="Engagement Rate"
          value={(kpis.avg_engagement_rate * 100).toFixed(1)}
          suffix="%"
          icon={<TrendingUp size={13} />}
        />
        <MetricCard
          label="Reels Publicados"
          value={kpis.total_reels}
          icon={<Film size={13} />}
        />
      </div>

      {/* Views + Goals */}
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-5">
        <div className="card-surface p-5 lg:col-span-3">
          <div className="mb-5">
            <h2 className="section-label">Reach mes a mes</h2>
          </div>
          <ViewsChart data={viewsTimeSeries} />
        </div>

        <div className="card-surface p-5 lg:col-span-2">
          <div className="mb-5">
            <h2 className="section-label">Objetivos del mes</h2>
          </div>
          <GoalsSectionClient followerCount={followerCount} currentMonthReach={currentMonthReach} />
        </div>
      </div>

      {/* Top content + Country */}
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        <div className="card-surface p-5">
          <h2 className="section-label mb-5">Top contenidos</h2>
          {topContent.length > 0 ? (
            <TopContent items={topContent} />
          ) : (
            <p className="text-[12px]" style={{ color: "var(--text-faint)" }}>
              No hay reels disponibles aún.
            </p>
          )}
        </div>

        <div className="card-surface p-5">
          <h2 className="section-label mb-5">Audiencia por país</h2>
          {countryData.length > 0 ? (
            <CountryChart data={countryData} />
          ) : (
            <p className="text-[12px]" style={{ color: "var(--text-faint)" }}>
              Datos de audiencia no disponibles.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
