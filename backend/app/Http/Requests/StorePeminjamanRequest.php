<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePeminjamanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:100'],
            'instansi' => ['required', 'string', 'max:150'],
            'no_telp' => ['nullable', 'string', 'max:20'],
            'barang' => ['required', 'string', 'max:200'],
            'detail_kebutuhan' => ['nullable', 'string'],
            'tanggal_mulai' => ['required', 'date', 'after_or_equal:today'],
            'tanggal_selesai' => ['required', 'date', 'after:tanggal_mulai'],
            'surat_pengantar' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'nama' => 'nama peminjam',
            'email' => 'email',
            'instansi' => 'asal instansi/UKM',
            'no_telp' => 'nomor telepon',
            'barang' => 'barang/fasilitas yang dipinjam',
            'detail_kebutuhan' => 'detail kebutuhan',
            'tanggal_mulai' => 'tanggal mulai',
            'tanggal_selesai' => 'tanggal selesai',
            'surat_pengantar' => 'surat pengantar',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'tanggal_mulai.after_or_equal' => 'Tanggal mulai tidak boleh di masa lalu.',
            'tanggal_selesai.after' => 'Tanggal selesai harus setelah tanggal mulai.',
            'surat_pengantar.mimes' => 'Surat pengantar harus berformat PDF, JPG, JPEG, atau PNG.',
            'surat_pengantar.max' => 'Ukuran surat pengantar maksimal 5MB.',
        ];
    }
}
