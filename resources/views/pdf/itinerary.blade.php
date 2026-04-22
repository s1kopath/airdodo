<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #1a1a2e; margin: 0; padding: 0; }
  .page { padding: 30px 40px; }
  .header { background: #1a1a2e; color: white; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; }
  .brand { font-size: 22px; font-weight: bold; letter-spacing: 2px; }
  .doc-type { font-size: 11px; opacity: 0.8; text-align: right; }
  .ref-box { background: #f0f4ff; border-left: 4px solid #4f46e5; padding: 10px 16px; margin: 16px 0; }
  .ref-box strong { font-size: 16px; color: #4f46e5; }
  .section-title { font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
  .flight-card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin-bottom: 16px; }
  .route { font-size: 20px; font-weight: bold; text-align: center; color: #1a1a2e; margin-bottom: 12px; }
  .route span { color: #4f46e5; }
  .flight-meta { display: table; width: 100%; }
  .meta-col { display: table-cell; width: 33%; padding: 4px 8px; }
  .meta-label { font-size: 9px; color: #9ca3af; text-transform: uppercase; }
  .meta-value { font-size: 13px; font-weight: bold; }
  table.pax { width: 100%; border-collapse: collapse; margin-top: 6px; }
  table.pax th { background: #f9fafb; padding: 7px 10px; text-align: left; font-size: 10px; color: #6b7280; border: 1px solid #e5e7eb; }
  table.pax td { padding: 7px 10px; border: 1px solid #e5e7eb; font-size: 11px; }
  .notice { background: #fef3c7; border: 1px solid #fbbf24; border-radius: 4px; padding: 10px 14px; margin-top: 20px; font-size: 10px; color: #78350f; }
  .footer { text-align: center; font-size: 9px; color: #9ca3af; margin-top: 30px; padding-top: 12px; border-top: 1px solid #e5e7eb; }
</style>
</head>
<body>
<div class="header">
  <div class="brand">✈ AirDodo</div>
  <div class="doc-type">FLIGHT ITINERARY<br>For Visa Application</div>
</div>

<div class="page">
  <div class="ref-box">
    Booking Reference: <strong>{{ $order->reference }}</strong> &nbsp;&nbsp;
    Issued: {{ now()->format('d M Y') }}
  </div>

  <div class="section-title">Flight Details</div>
  <div class="flight-card">
    <div class="route">
      {{ $order->flight->origin->iata_code }} <span>→</span> {{ $order->flight->destination->iata_code }}
    </div>
    <div style="text-align:center; color:#6b7280; margin-bottom: 10px;">
      {{ $order->flight->origin->city }} to {{ $order->flight->destination->city }}
    </div>
    <div class="flight-meta">
      <div class="meta-col">
        <div class="meta-label">Airline</div>
        <div class="meta-value">{{ $order->flight->airline->name }}</div>
      </div>
      <div class="meta-col">
        <div class="meta-label">Flight</div>
        <div class="meta-value">{{ $order->flight->flight_number }}</div>
      </div>
      <div class="meta-col">
        <div class="meta-label">Aircraft</div>
        <div class="meta-value">{{ $order->flight->aircraft_type ?: 'N/A' }}</div>
      </div>
    </div>
    <div class="flight-meta" style="margin-top:10px;">
      <div class="meta-col">
        <div class="meta-label">Date</div>
        <div class="meta-value">{{ $order->travel_date->format('D, d M Y') }}</div>
      </div>
      <div class="meta-col">
        <div class="meta-label">Departure</div>
        <div class="meta-value">{{ $order->flight->departure_time }}</div>
      </div>
      <div class="meta-col">
        <div class="meta-label">Arrival</div>
        <div class="meta-value">{{ $order->flight->arrival_time }}</div>
      </div>
    </div>
    <div class="flight-meta" style="margin-top:10px;">
      <div class="meta-col">
        <div class="meta-label">Duration</div>
        <div class="meta-value">{{ $order->flight->duration_hours }}h {{ $order->flight->duration_minutes }}m</div>
      </div>
      <div class="meta-col">
        <div class="meta-label">Cabin</div>
        <div class="meta-value">{{ $order->flight->cabin_class }}</div>
      </div>
      <div class="meta-col">
        <div class="meta-label">Status</div>
        <div class="meta-value" style="color:#16a34a;">CONFIRMED</div>
      </div>
    </div>
  </div>

  <div class="section-title">Passenger Details</div>
  <table class="pax">
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Type</th>
        <th>Date of Birth</th>
        <th>Nationality</th>
        <th>Passport No.</th>
        <th>Passport Expiry</th>
      </tr>
    </thead>
    <tbody>
      @foreach($order->passengers as $i => $p)
      <tr>
        <td>{{ $i + 1 }}</td>
        <td>{{ $p->title }} {{ strtoupper($p->last_name) }}, {{ $p->first_name }}</td>
        <td>{{ ucfirst($p->type) }}</td>
        <td>{{ $p->date_of_birth->format('d M Y') }}</td>
        <td>{{ $p->nationality }}</td>
        <td>{{ $p->passport_number ?: '—' }}</td>
        <td>{{ $p->passport_expiry?->format('d M Y') ?: '—' }}</td>
      </tr>
      @endforeach
    </tbody>
  </table>

  <div class="section-title">Contact</div>
  <p style="margin:4px 0;">{{ $order->contact_name }} &nbsp;|&nbsp; {{ $order->contact_email }} @if($order->contact_phone) &nbsp;|&nbsp; {{ $order->contact_phone }} @endif</p>

  <div class="notice">
    <strong>Important Notice:</strong> This document is a flight itinerary generated for visa application purposes only.
    It is not a confirmed airline ticket. The holder must purchase an actual airline ticket prior to travel.
    AirDodo does not operate flights and is not affiliated with any airline.
  </div>

  <div class="footer">
    Generated by AirDodo &bull; airdodo.com &bull; This itinerary is valid for visa application purposes only.
  </div>
</div>
</body>
</html>
