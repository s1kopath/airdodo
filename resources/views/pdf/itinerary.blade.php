<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @page { margin: 0; }
  body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11px; color: #334155; margin: 0; padding: 0; line-height: 1.5; }
  .header { background: #0f172a; color: white; padding: 30px 45px; position: relative; }
  .brand { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 5px; }
  .brand span { color: #0ea5e9; }
  .doc-info { position: absolute; right: 45px; top: 35px; text-align: right; }
  .doc-type { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
  .doc-id { font-size: 10px; opacity: 0.7; margin-top: 5px; }

  .container { padding: 40px 45px; }
  
  .ref-grid { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
  .ref-item { border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
  .label { font-size: 8px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
  .value { font-size: 14px; font-weight: 700; color: #0f172a; }
  .value.brand-text { color: #0ea5e9; }

  .section-header { background: #f8fafc; border-left: 4px solid #0ea5e9; padding: 8px 15px; margin-bottom: 20px; }
  .section-title { font-size: 10px; font-weight: 800; color: #1e293b; text-transform: uppercase; letter-spacing: 1px; }

  .flight-box { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 30px; }
  .flight-header { background: #f1f5f9; padding: 12px 20px; border-bottom: 1px solid #e2e8f0; }
  .flight-header table { width: 100%; }
  .flight-num { font-weight: 800; font-size: 12px; color: #0f172a; }
  
  .route-table { width: 100%; padding: 25px 20px; }
  .airport-code { font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1; }
  .airport-name { font-size: 9px; color: #64748b; font-weight: 600; margin-top: 5px; }
  .arrow { color: #0ea5e9; font-size: 24px; text-align: center; }

  .details-grid { width: 100%; border-collapse: collapse; border-top: 1px solid #e2e8f0; }
  .details-grid td { padding: 15px 20px; border-right: 1px solid #e2e8f0; width: 25%; }
  .details-grid td:last-child { border-right: none; }

  .pax-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
  .pax-table th { background: #f8fafc; text-align: left; padding: 12px 15px; font-size: 9px; font-weight: 800; color: #475569; border-bottom: 2px solid #e2e8f0; text-transform: uppercase; }
  .pax-table td { padding: 12px 15px; border-bottom: 1px solid #f1f5f9; font-size: 10px; font-weight: 600; }
  
  .footer-notice { background: #fffbeb; border: 1px solid #fef3c7; padding: 20px; border-radius: 10px; margin-top: 40px; }
  .notice-title { font-weight: 800; font-size: 9px; color: #92400e; text-transform: uppercase; margin-bottom: 5px; }
  .notice-text { font-size: 9px; color: #b45309; line-height: 1.4; }

  .official-footer { text-align: center; margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
  .footer-text { font-size: 8px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  
  .watermark { position: absolute; top: 40%; left: 10%; font-size: 80px; color: #f1f5f9; transform: rotate(-30deg); z-index: -1; font-weight: 900; opacity: 0.5; }
</style>
</head>
<body>
  <div class="watermark">VISA ITINERARY</div>

  <div class="header">
    <div class="brand">AIR<span>DODO</span></div>
    <div class="doc-info">
      <div class="doc-type">Flight Reservation</div>
      <div class="doc-id">Reference: #{{ $order->reference }}</div>
    </div>
  </div>

  <div class="container">
    <table class="ref-grid">
      <tr>
        <td style="padding-right: 15px; width: 50%;">
          <div class="ref-item">
            <div class="label">Booking Reference</div>
            <div class="value brand-text">{{ $order->reference }}</div>
          </div>
        </td>
        <td style="width: 50%;">
          <div class="ref-item">
            <div class="label">Date of Issue</div>
            <div class="value">{{ now()->format('d F Y') }}</div>
          </div>
        </td>
      </tr>
    </table>

    <div class="section-header">
      <div class="section-title">Outbound Journey Details</div>
    </div>

    <div class="flight-box">
      <div class="flight-header">
        <table>
          <tr>
            <td class="flight-num">{{ $order->flight->airline->name }} &bull; {{ $order->flight->flight_number }}</td>
            <td style="text-align: right; font-weight: 800; color: #0ea5e9;">CONFIRMED</td>
          </tr>
        </table>
      </div>
      
      <table class="route-table">
        <tr>
          <td width="40%">
            <div class="airport-code">{{ $order->flight->origin->iata_code }}</div>
            <div class="airport-name">{{ strtoupper($order->flight->origin->city) }}</div>
          </td>
          <td width="20%" class="arrow">✈</td>
          <td width="40%" style="text-align: right;">
            <div class="airport-code">{{ $order->flight->destination->iata_code }}</div>
            <div class="airport-name">{{ strtoupper($order->flight->destination->city) }}</div>
          </td>
        </tr>
      </table>

      <table class="details-grid">
        <tr>
          <td>
            <div class="label">Departure</div>
            <div class="value">{{ $order->flight->departure_time }}</div>
            <div style="font-size: 8px; color: #94a3b8; margin-top: 3px;">{{ $order->travel_date->format('D, d M Y') }}</div>
          </td>
          <td>
            <div class="label">Arrival</div>
            <div class="value">{{ $order->flight->arrival_time }}</div>
            <div style="font-size: 8px; color: #94a3b8; margin-top: 3px;">{{ $order->travel_date->format('D, d M Y') }}</div>
          </td>
          <td>
            <div class="label">Class</div>
            <div class="value">{{ $order->flight->cabin_class }}</div>
          </td>
          <td>
            <div class="label">Duration</div>
            <div class="value">{{ $order->flight->duration_hours }}h {{ $order->flight->duration_minutes }}m</div>
          </td>
        </tr>
      </table>
    </div>

    <div class="section-header">
      <div class="section-title">Passenger Manifest</div>
    </div>

    <table class="pax-table">
      <thead>
        <tr>
          <th>Name of Passenger</th>
          <th>Traveler Type</th>
          <th>Passport Number</th>
          <th>Nationality</th>
        </tr>
      </thead>
      <tbody>
        @foreach($order->passengers as $p)
        <tr>
          <td>{{ $p->title }} {{ strtoupper($p->last_name) }}, {{ $p->first_name }}</td>
          <td>{{ strtoupper($p->type) }}</td>
          <td style="font-family: monospace; letter-spacing: 1px;">{{ $p->passport_number ?: 'NOT PROVIDED' }}</td>
          <td>{{ strtoupper($p->nationality) }}</td>
        </tr>
        @endforeach
      </tbody>
    </table>

    <div class="footer-notice">
      <div class="notice-title">Official Notice for Embassy / Consular Officers</div>
      <div class="notice-text">
        This document is a computer-generated flight itinerary prepared for the purpose of a visa application. It reflects a valid flight schedule and passenger reservation. Please note that this is not an airline ticket. The final ticket will be issued upon visa approval and full payment. For verification of this itinerary, please contact AirDodo support or use the reference number provided above.
      </div>
    </div>

    <div class="official-footer">
      <div class="footer-text">
        Generated by AirDodo Global Travel Services &bull; airdodo.com &bull; Verified Electronic Document
      </div>
    </div>
  </div>
</body>
</html>

