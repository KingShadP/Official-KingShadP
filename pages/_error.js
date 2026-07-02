import Link from 'next/link'

export default function CustomError({ statusCode }) {
  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', textAlign: 'center', backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#93000a', letterSpacing: '0.4em', fontSize: '10px' }}>[ ACCESS_ERROR // DECRYPTED_VOID ]</p>
      <h1 style={{ fontWeight: '300', fontSize: '3rem', margin: '20px 0' }}>
        {statusCode ? `Error ${statusCode}` : 'An error occurred'}
      </h1>
      <div style={{ width: '64px', height: '1px', backgroundColor: 'rgba(244, 244, 245, 0.3)', margin: '20px 0' }}></div>
      <Link href="/" style={{ color: '#f4f4f5', textDecoration: 'none', border: '1px solid #f4f4f5', padding: '10px 20px', fontSize: '12px', letterSpacing: '0.2em' }}>
        [ Go Back // Return to Core ]
      </Link>
    </div>
  )
}

CustomError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

