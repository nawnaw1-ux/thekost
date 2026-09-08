<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <link rel="stylesheet" href="{{ public_path('invoice.css') }}">
</head>
<body>
    <div class="invoice-box">
        <div>
            <table cellpadding="0" cellspacing="0">
                <tr class="top">
                    <td colspan="4">
                        <table>
                            <tr>
                                <td class="title">
                                    <img src="{{ public_path('assets/Logo/logo1.png') }}" alt="Company logo" style="width:200px;">
                                </td>
                                <td>
                                    <div class="invoice-details">
                                        <h2 style="text-align: center; color: #ffffff">INVOICE</h2>
                                        <table class="blueTable">
                                            <tbody>
                                            <tr>
                                                <td><strong style="color: #ffffff">Invoice No</strong></td>
                                            
                                                <td><span style="color: #000000; text-align: right; font-weight: bold">{{ $bill['invoice'] }}</span></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong style=" color : #ffffff">Date</strong>
                                                </td>
                                                <td>
                                                    <span style="color: #000000; text-align: right; font-weight: bold">{{ $bill["date_payment"] }}</span>
                                                </td>
                                            </tr>
                                            </tbody>
                                           
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr class="information">
                    <td colspan="4">
                        <table>
                            <tr>
                                <td>
                                    <p>BILL TO:</p>
                                    <strong>{{ $user['name'] }}</strong><br>
                                    {{ $user['email'] }}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr class="heading">
                    <td style="width: 5%; color: #ffffff">No</td>
                    <td style="width: 65%;color: #ffffff">Deskripsi</td>
                    <td style="width: 30%;color: #ffffff">Total</td>
                </tr>
              @foreach ($items as $item)
<tr class="item">
    <td style="background-color: #ececec;">{{ $item['no'] }}</td>
    <td>{{ $item['name'] }}</td>
    <td style="background-color: #ececec;">Rp {{ $item['price'] }}</td>
</tr>
@endforeach
              

            </table>
          <div class="container">
            <table>
                <tr>
                    <td style="width: 5%"></td>
                    <td style="width: 25%">
                      
                    </td>
                    <td style="width: 15%"></td>
                    <td></td>
                    <td style="width: 30%"></td>
                </tr>
                <tr >
                    <td style="width: 5%; background-color: #987CC0"></td>
                    <td rowspan="2" style="width: 25%">
                        <div>
 <span>Metode Pembayaran :</span>
 <br>
                        <strong>Bank Transfer</strong>
                        </div>
                       
                    </td>
                    <td style="width: 15%"></td>
                    <td></td>
                    <td style="width: 30%"></td>
                </tr>
                <tr>
                     <td style="width: 5%; background-color: #987CC0"></td>
                  
                    <td style="width: 15%; background-color: #987CC0"></td>
                    <td style="background-color: #987CC0; color: #ffffff"><strong>TOTAL PEMBAYARAN</strong></td>
                    <td style="background-color: #987CC0; width: 30%;  color: #ffffff">Rp {{ $subtotal }}</td>
                </tr>
            </table>
    </div>
        </div>

        <table style="margin-top: 50px; color: #ffffff">
            <tr style="width: 20%">
                <td style="background-color: red ; width: 20px; height: 10px"></td>
                <td style=" color : black">Notes : <strong>Non Refundable</strong></td>
            </tr>
        </table>
        <div class="footer">
            <p class="thank-you">Terimakasih telah melakukan pembayaran</p>
            <p> {{  $boardingBranch['name'] }} /{{  $boardingBranch['address'] }} / {{  $boardingBranch['phone_number'] }}</p>
        </div>
    </div>
</body>
</html>
