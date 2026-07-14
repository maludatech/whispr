export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <div>Public link for @{username} — coming in Stage 5</div>;
}
