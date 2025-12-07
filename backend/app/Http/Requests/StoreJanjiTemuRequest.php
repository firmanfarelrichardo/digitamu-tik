<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
use Carbon\Carbon;

class StoreJanjiTemuRequest extends FormRequest
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
            'no_telp' => ['nullable', 'string', 'max:20'],
            'bertemu_siapa' => ['required', 'string', 'max:200'],
            'waktu_janji_temu' => ['required', 'date', 'after:now'],
            'topik_diskusi' => ['required', 'string'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($this->waktu_janji_temu) {
                $waktu = Carbon::parse($this->waktu_janji_temu);
                $jam = $waktu->hour;
                
                // Validasi jam kerja TIK: 08:00 - 15:00
                if ($jam < 8 || $jam >= 15) {
                    $validator->errors()->add(
                        'waktu_janji_temu',
                        'Jam kunjungan harus dalam jam kerja TIK (08:00 - 15:00 WIB).'
                    );
                }
                
                // Validasi hari kerja (Senin-Jumat)
                if ($waktu->isWeekend()) {
                    $validator->errors()->add(
                        'waktu_janji_temu',
                        'Kunjungan hanya dapat dilakukan pada hari kerja (Senin - Jumat).'
                    );
                }
            }
        });
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'nama' => 'nama lengkap',
            'email' => 'email',
            'no_telp' => 'nomor telepon',
            'bertemu_siapa' => 'tujuan bertemu',
            'waktu_janji_temu' => 'waktu janji temu',
            'topik_diskusi' => 'topik diskusi',
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
            'waktu_janji_temu.after' => 'Waktu janji temu harus di masa depan.',
        ];
    }
}
