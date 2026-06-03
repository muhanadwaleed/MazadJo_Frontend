/** Root layout — locale-specific html/body live under `[locale]/layout.tsx`. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
