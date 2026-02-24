export default function BookingCancellationPage({
  params,
}: {
  params: { locale: string; token: string };
}) {
  return (
    <div>
      <h1>Booking Cancellation</h1>
      <p>Token: {params.token}</p>
    </div>
  );
}