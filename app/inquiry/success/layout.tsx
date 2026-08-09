import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Confirmation',
  robots: {
    index: false,
    follow: false,
  },
}

export default function InquirySuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
