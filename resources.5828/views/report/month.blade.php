<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; font-size: 10px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        .table, .table th, .table td { border: 1px solid #000; }
        .table th { padding: 10px 5px; text-align: center; }
        .total-row { font-weight:700;}
        .page-break { page-break-before: always; }

        table.layout-table { width: 100%; margin-top: 16px; border-collapse: collapse; }
        td.box-left { width: 30%; }
        .data-pemasukkan {
            width: 350.7px;
            background-color: #cfe2f3;
            border: 1px solid #000;
            text-align: center;
            font-size: 13px;
            font-weight: bold;
            padding: 17px 20px;
        }
        td.box-right { width: 22.6%; vertical-align: top; }
        table.info-table {
            width: 100%;
            border-collapse: collapse;
            margin-left: auto;
        }
        .info-table th, .info-table td {
            border: 1px solid #000;
            padding: 6px;
            text-align: center;
        }
        .info-table th { background-color: #e7e3f3; }
    </style>
</head>
<body>

@foreach ($data as $index => $monthData)

    <img src="{{ public_path('assets/Logo/logo1.png') }}" alt="Company logo" style="width:170px;">

    <table class="layout-table">
        <tr>
            <td class="box-left">
                <div class="data-pemasukkan">DATA PEMASUKAN & PENGELUARAN</div>
            </td>
            <td class="box-right">
                <table class="info-table">
                    <tr>
                        <th>NAMA PROPERTI</th>
                        <th colspan="2">PERIODE</th>
                    </tr>
                    <tr>
                        <td>THEKOST - MEDOKAN AYU</td>
                        <td style="width: 100px;">{{ $monthData['periode'] }}</td>
                        <td style="width: 110px;"> {{ $monthData['tahun'] }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    @php
        $totalPemasukan = 0;
        $totalPengeluaran = 0;

        $gabunganPemasukkan = [];

        foreach ($monthData['pemasukkan'] as $p) {
            $gabunganPemasukkan[] = array_merge($p, ['sumber' => 'Pembayaran']);
        }

        foreach ($monthData['pemasukan_denda'] as $d) {
            $gabunganPemasukkan[] = array_merge($d, ['sumber' => 'Denda']);
        }

        $max = max(count($gabunganPemasukkan), count($monthData['pengeluaran']));
    @endphp

    <table class="table">
     
        <tr>
            <th  style="background-color:#CCC0DA; width: 16px;">No.</th>
            <th style="background-color:#CCC0DA;width: 16px;">Tgl</th>
            <th style="background-color:#CCC0DA;">Jenis</th>
            <th style="background-color:#CCC0DA;">Jumlah</th>
            <th style="background-color:#CCC0DA;">Keterangan</th>

            <th style="background-color:#60497A; color:white; width: 16px;">No.</th>
            <th style="background-color:#60497A; color:white;width: 16px;">Tgl</th>
            <th style="background-color:#60497A; color:white;">Jenis</th>
            <th style="background-color:#60497A; color:white;">Jumlah</th>
            <th style="background-color:#60497A; color:white;">Keterangan</th>
        </tr>

        @for ($i = 0; $i < $max; $i++)
            <tr>
                {{-- Pemasukan --}}
                <td  style=" text-align: center; padding: 2px">{{ $i+1 }}</td>
                <td style=" text-align: center;" >{{ $gabunganPemasukkan[$i]['tanggal'] ?? '' }}</td>
                <td style="color: {{ ($gabunganPemasukkan[$i]['sumber'] ?? '') == 'Denda' ? 'red' : 'black' }}; width: 150px; text-align: start; padding: 2px">
                    {{ $gabunganPemasukkan[$i]['jenis'] ?? '' }}
                </td>
                             <td style="width: 80px; padding:2px;">
    <table style="width: 100%;">
        <tr>
            <td style="text-align: left; border-color: #FFFFFF;">Rp</td>
            <td style="text-align: right;border-color: #FFFFFF;">{{ number_format($monthData['pemasukkan'][$i]['jumlah'] ?? 0, 0, ',', '.') }}</td>
        </tr>
    </table>
</td>
             <td style="width: 90px; text-align: {{ empty($gabunganPemasukkan[$i]['keterangan']) ? 'center' : 'left' }};">
    {{ $gabunganPemasukkan[$i]['keterangan'] ?? '-' }}
</td>

                {{-- Pengeluaran --}}
                <td style=" text-align: center;" >{{ $i+1 }}</td>
                <td style=" text-align: center;" >{{ $monthData['pengeluaran'][$i]['tanggal'] ?? '' }}</td>
                <td  style="text-align: start;width: 150px;"> {{ $monthData['pengeluaran'][$i]['jenis'] ?? '' }}</td>
   <td style="width: 80px; padding:2px;">
    <table style="width: 100%;">
        <tr>
            <td style="text-align: left; border-color: #FFFFFF;">Rp</td>
            <td style="text-align: right;border-color: #FFFFFF;">{{ number_format($monthData['pengeluaran'][$i]['jumlah'] ?? 0, 0, ',', '.') }}</td>
        </tr>
    </table>
</td>
            <td style="width: 90px; text-align: {{ empty($monthData['pengeluaran'][$i]['keterangan']) ? 'center' : 'left' }};">
    {{ $monthData['pengeluaran'][$i]['keterangan'] ?? '-' }}
</td>

            </tr>

            @php
                $totalPemasukan += $gabunganPemasukkan[$i]['jumlah'] ?? 0;
                $totalPengeluaran += $monthData['pengeluaran'][$i]['jumlah'] ?? 0;
            @endphp
        @endfor

        <tr class="total-row">
            <td colspan="3" style="text-align:right; padding: 10px; background-color:#CCC0DA;">TOTAL PEMASUKAN</td>
            <td colspan="2" style="text-align:center;background-color:#CCC0DA;">Rp{{ number_format($totalPemasukan, 0, ',', '.') }}</td>
            <td colspan="3" style="text-align:right;background-color:#60497A; color:white; padding: 10px;">TOTAL PENGELUARAN</td>
            <td colspan="2" style="text-align:center;background-color:#60497A;color:white;">Rp{{ number_format($totalPengeluaran, 0, ',', '.') }}</td>
        </tr>
    </table>

    <!-- Keuntungan -->
    <table style="width:100%; border-collapse: collapse; margin-top: 16px; margin-left: -1px;">
        <tr>
            <td style="width: 50.55%;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background-color: #e2efda;">
                        <td style="border: 1px solid #000; padding: 10px; text-align: right; font-weight: bold; width: 54.1%;">TOTAL KEUNTUNGAN</td>
                        <td style="border: 1px solid #000; text-align: center; font-weight: bold;">
                            Rp {{ number_format($totalPemasukan - $totalPengeluaran, 0, ',', '.') }}
                        </td>
                    </tr>
                </table>
            </td>
            <td style="width: 50%;"></td>
        </tr>
    </table>

    @if (!$loop->last)
        <div class="page-break"></div>
    @endif
@endforeach

</body>
</html>
