<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StatusKonfirmasi extends Mailable
{
    use Queueable, SerializesModels;

    public $tamu;
    public $type; // 'janji-temu' or 'peminjaman'
    public $status; // 'disetujui' or 'ditolak'
    public $details;

    /**
     * Create a new message instance.
     */
    public function __construct($tamu, string $type, string $status, array $details = [])
    {
        $this->tamu = $tamu;
        $this->type = $type;
        $this->status = $status;
        $this->details = $details;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $typeLabel = $this->type === 'janji-temu' ? 'Janji Temu' : 'Peminjaman';
        $statusLabel = $this->status === 'disetujui' ? 'Disetujui' : 'Ditolak';
        $ticketId = strtoupper(substr($this->details['id'] ?? '', 0, 8));
        
        return new Envelope(
            subject: "Permohonan {$typeLabel} {$statusLabel} [#{$ticketId}] - UPA TIK Unila",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.status_konfirmasi',
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
