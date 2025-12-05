<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Status Permohonan - DigiTamu UPA TIK Unila</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F3F4F6;">
    <!-- Outer Wrapper -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F3F4F6;">
        <tr>
            <td style="padding: 40px 20px;">
                <!-- Main Card Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: {{ $status === 'disetujui' ? '#059669' : '#DC2626' }}; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; color: #FFFFFF; font-size: 20px; letter-spacing: 1px;">
                                DIGITAMU | UPA TIK UNILA
                            </h1>
                        </td>
                    </tr>

                    <!-- Status Banner -->
                    <tr>
                        <td style="padding: 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="background-color: {{ $status === 'disetujui' ? '#D1FAE5' : '#FEE2E2' }}; padding: 20px; text-align: center;">
                                        @if($status === 'disetujui')
                                            <span style="font-size: 40px;">✅</span>
                                            <h2 style="margin: 10px 0 0 0; color: #059669; font-size: 18px; font-weight: 700;">
                                                PERMOHONAN DISETUJUI
                                            </h2>
                                        @else
                                            <span style="font-size: 40px;">❌</span>
                                            <h2 style="margin: 10px 0 0 0; color: #DC2626; font-size: 18px; font-weight: 700;">
                                                PERMOHONAN DITOLAK
                                            </h2>
                                        @endif
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 40px 35px;">
                            
                            <!-- Greeting -->
                            <p style="margin: 0 0 10px 0; font-size: 16px; color: #1F2937; font-weight: 600;">
                                Halo, {{ $tamu->nama }}
                            </p>
                            
                            @if($status === 'disetujui')
                                <p style="margin: 0 0 30px 0; font-size: 14px; color: #6B7280; line-height: 1.6;">
                                    Selamat! Permohonan <strong>{{ $type === 'janji-temu' ? 'Janji Temu' : 'Peminjaman Fasilitas' }}</strong> Anda telah <strong style="color: #059669;">DISETUJUI</strong> oleh staff UPA TIK Universitas Lampung.
                                </p>
                            @else
                                <p style="margin: 0 0 30px 0; font-size: 14px; color: #6B7280; line-height: 1.6;">
                                    Mohon maaf, permohonan <strong>{{ $type === 'janji-temu' ? 'Janji Temu' : 'Peminjaman Fasilitas' }}</strong> Anda telah <strong style="color: #DC2626;">DITOLAK</strong> oleh staff UPA TIK Universitas Lampung.
                                </p>
                            @endif

                            <!-- Ticket ID Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                                <tr>
                                    <td style="background-color: #F9FAFB; border: 2px dashed #D1D5DB; border-radius: 8px; padding: 20px; text-align: center;">
                                        <p style="margin: 0 0 8px 0; font-size: 11px; color: #9CA3AF; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">
                                            ID Permohonan
                                        </p>
                                        <p style="margin: 0; font-size: 24px; color: #000000; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 2px;">
                                            {{ strtoupper(substr($details['id'] ?? '', 0, 8)) }}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Detail Section Header -->
                            <h2 style="margin: 0 0 20px 0; font-size: 14px; color: #374151; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-left: 4px solid {{ $status === 'disetujui' ? '#059669' : '#DC2626' }}; padding-left: 12px;">
                                Detail {{ $type === 'janji-temu' ? 'Janji Temu' : 'Peminjaman' }}
                            </h2>

                            <!-- Data Grid -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="width: 35%; font-size: 13px; color: #6B7280; font-weight: 600;">Nama Lengkap</td>
                                                <td style="font-size: 14px; color: #1F2937;">{{ $tamu->nama }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="width: 35%; font-size: 13px; color: #6B7280; font-weight: 600;">Email</td>
                                                <td style="font-size: 14px; color: #1F2937;">{{ $tamu->email }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="width: 35%; font-size: 13px; color: #6B7280; font-weight: 600;">Instansi</td>
                                                <td style="font-size: 14px; color: #1F2937;">{{ $tamu->instansi ?? 'Umum' }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                @if($type === 'janji-temu')
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="width: 35%; font-size: 13px; color: #6B7280; font-weight: 600;">Waktu Janji Temu</td>
                                                    <td style="font-size: 14px; color: #1F2937;">
                                                        {{ $details['tanggal'] ?? '-' }}
                                                        <br>
                                                        <span style="color: #000000; font-weight: 600;">{{ $details['jam'] ?? '' }}</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="width: 35%; font-size: 13px; color: #6B7280; font-weight: 600;">Keperluan</td>
                                                    <td style="font-size: 14px; color: #1F2937;">{!! nl2br(e($details['keperluan'] ?? '-')) !!}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                @else
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="width: 35%; font-size: 13px; color: #6B7280; font-weight: 600;">Judul Permohonan</td>
                                                    <td style="font-size: 14px; color: #1F2937;">{{ $details['judul'] ?? '-' }}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="width: 35%; font-size: 13px; color: #6B7280; font-weight: 600;">Detail Kebutuhan</td>
                                                    <td style="font-size: 14px; color: #1F2937;">{{ $details['detail'] ?? '-' }}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="width: 35%; font-size: 13px; color: #6B7280; font-weight: 600;">Tanggal Peminjaman</td>
                                                    <td style="font-size: 14px; color: #1F2937;">
                                                        {{ $details['tanggalMulai'] ?? '-' }} s/d {{ $details['tanggalSelesai'] ?? '-' }}
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                @endif
                                
                                <tr>
                                    <td style="padding: 12px 0;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="width: 35%; font-size: 13px; color: #6B7280; font-weight: 600;">Status</td>
                                                <td style="font-size: 14px; color: #1F2937;">
                                                    @if($status === 'disetujui')
                                                        <span style="display: inline-block; background-color: #D1FAE5; color: #059669; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 600;">
                                                            Disetujui
                                                        </span>
                                                    @else
                                                        <span style="display: inline-block; background-color: #FEE2E2; color: #DC2626; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 600;">
                                                            Ditolak
                                                        </span>
                                                    @endif
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            @if($status === 'disetujui')
                                <!-- Info Box for Approved -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px;">
                                    <tr>
                                        <td style="background-color: #D1FAE5; border-left: 4px solid #059669; padding: 15px 20px; border-radius: 0 8px 8px 0;">
                                            <p style="margin: 0; font-size: 13px; color: #065F46; line-height: 1.5;">
                                                @if($type === 'janji-temu')
                                                    <strong>Langkah Selanjutnya:</strong><br>
                                                    Silakan datang ke UPA TIK Universitas Lampung pada waktu yang telah ditentukan. Jangan lupa membawa kartu identitas untuk proses check-in.
                                                @else
                                                    <strong>Langkah Selanjutnya:</strong><br>
                                                    Silakan datang ke UPA TIK Universitas Lampung pada tanggal yang telah ditentukan untuk mengambil barang/fasilitas yang dipinjam. Jangan lupa membawa kartu identitas.
                                                @endif
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            @else
                                <!-- Alasan Penolakan Box -->
                                @if(!empty($details['alasan_penolakan']))
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                    <tr>
                                        <td style="background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 20px;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td>
                                                        <p style="margin: 0 0 10px 0; font-size: 13px; color: #B45309; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                                                            ⚠️ Alasan Penolakan
                                                        </p>
                                                        <p style="margin: 0; font-size: 14px; color: #78350F; line-height: 1.6; background-color: #FFFBEB; padding: 12px; border-radius: 6px;">
                                                            {!! nl2br(e($details['alasan_penolakan'])) !!}
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                @endif

                                <!-- Info Box for Rejected -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px;">
                                    <tr>
                                        <td style="background-color: #FEE2E2; border-left: 4px solid #DC2626; padding: 15px 20px; border-radius: 0 8px 8px 0;">
                                            <p style="margin: 0; font-size: 13px; color: #991B1B; line-height: 1.5;">
                                                <strong>Informasi:</strong><br>
                                                Jika Anda memiliki pertanyaan mengenai penolakan ini, silakan hubungi UPA TIK Universitas Lampung untuk informasi lebih lanjut.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            @endif

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F9FAFB; padding: 25px 35px; border-radius: 0 0 12px 12px; border-top: 1px solid #E5E7EB;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center;">
                                        <p style="margin: 0 0 5px 0; font-size: 12px; color: #6B7280; font-weight: 600;">
                                            UPA TIK Universitas Lampung
                                        </p>
                                        <p style="margin: 0 0 15px 0; font-size: 11px; color: #9CA3AF; line-height: 1.5;">
                                            Jl. Prof. Dr. Ir. Sumantri Brojonegoro No.1<br>
                                            Gedung Meneng, Bandar Lampung
                                        </p>
                                        <p style="margin: 0; font-size: 10px; color: #9CA3AF;">
                                            Email ini dikirim secara otomatis oleh sistem DigiTamu.<br>
                                            Mohon tidak membalas email ini.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
