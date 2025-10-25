import Head from 'next/head'
import Header from '../components/Header'
import Button from '../components/Button'

export default function Home() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  return (
    <div className="min-h-screen bg-mhbg text-mhcharcoal">
      <Head>
        <title>Automated Attendance — Solvra</title>
      </Head>
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-20">
        <section className="text-center">
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-4">Automated Attendance & Marks</h1>
          <p className="text-mhmuted max-w-2xl mx-auto mb-8">Geo-fencing, QR codes and Face ID combined into a single elegant system for reliable attendance and mark capture.</p>

          <div className="flex justify-center gap-4">
            <Button onClick={() => window.alert('Integrate: ' + api)}>
              Connect to Backend
            </Button>
            <Button variant="outline">Explore Demo</Button>
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          <Card title="QR-based" desc="Quick generation & scanned attendance." />
          <Card title="Face ID" desc="Secure verification for faculty & students." />
          <Card title="Geo-fence" desc="Attendances gated by location." />
        </section>
      </main>
    </div>
  )
}

function Card({ title, desc }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="font-display text-lg mb-2">{title}</h3>
      <p className="text-sm text-mhmuted">{desc}</p>
    </div>
  )
}
