import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Layout from '../../../../../layout';
import Swal from 'sweetalert2';
import { Breadcrumb, ButtonOne, ButtonTwo } from '../../../../../components';
import { getMe } from '../../../../../config/redux/action';

// ─── Constants ───────────────────────────────────────────────────────────────
const API_URL = 'http://localhost:5000';

// Helpers for the date-window validation
const toDateOnly = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const isDateValid = (dateStr) => {
    if (!dateStr) return false;

    const selected = toDateOnly(new Date(dateStr));
    const today    = toDateOnly(new Date());

    // Must not be in the future
    if (selected > today) return false;

    // Must not be older than 7 days
    const diffMs   = today - selected;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
};

// ─── Component ───────────────────────────────────────────────────────────────
const FormAddDataLembur = () => {
    // Form field state — mirrors the four required fields
    const [workerId, setWorkerId] = useState('');
    const [date,     setDate]     = useState('');
    const [hours,    setHours]    = useState('');
    const [reason,   setReason]   = useState('');

    // Per-field error messages shown inline beneath each input
    const [errors, setErrors] = useState({});

    // Loading flag so the submit button disables while the request is in-flight
    const [loading, setLoading] = useState(false);

    // Auth guard (same pattern as every other admin form in this project)
    const { isError, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ── Auth guard effects ────────────────────────────────────────────────────
    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) navigate('/login');
        if (user && user.hak_akses !== 'admin') navigate('/dashboard');
    }, [isError, user, navigate]);

    // ── Validation ────────────────────────────────────────────────────────────
    // Returns an object with one key per invalid field; empty object = all valid
    const validate = () => {
        const newErrors = {};

        if (!workerId.trim()) {
            newErrors.workerId = 'Worker ID wajib diisi.';
        }

        if (!date) {
            newErrors.date = 'Tanggal wajib diisi.';
        } else if (!isDateValid(date)) {
            newErrors.date = 'Tanggal tidak boleh di masa depan atau lebih dari 7 hari yang lalu.';
        }

        const hoursNum = Number(hours);
        if (hours === '') {
            newErrors.hours = 'Jam lembur wajib diisi.';
        } else if (!Number.isInteger(hoursNum) || hoursNum < 1 || hoursNum > 6) {
            newErrors.hours = 'Jam lembur harus antara 1 – 6 jam.';
        }

        if (!reason.trim()) {
            newErrors.reason = 'Alasan wajib diisi.';
        } else if (reason.trim().length < 10) {
            newErrors.reason = 'Alasan minimal 10 karakter.';
        }

        return newErrors;
    };

    // ── Submit handler ────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Run validation first; if anything failed, show errors and stop
        const foundErrors = validate();
        if (Object.keys(foundErrors).length > 0) {
            setErrors(foundErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            await axios.post(`${API_URL}/data_lembur`, {
                worker_id : workerId.trim(),
                tanggal   : date,
                jam_lembur: Number(hours),
                alasan    : reason.trim(),
            });

            Swal.fire({
                icon             : 'success',
                title            : 'Berhasil',
                text             : 'Data lembur berhasil disimpan.',
                showConfirmButton: false,
                timer            : 1500,
            });

            navigate('/data-lembur');
        } catch (error) {
            Swal.fire({
                icon : 'error',
                title: 'Gagal',
                text : error.response?.data?.msg || 'Terjadi kesalahan, coba lagi.',
            });
        } finally {
            setLoading(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <Layout>
            <Breadcrumb pageName="Form Input Data Lembur" />

            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 mt-6">
                <form onSubmit={handleSubmit} noValidate>

                    {/* ── Worker ID ─────────────────────────────────────────── */}
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                            Worker ID / NIK
                        </label>
                        <input
                            type="text"
                            placeholder="Masukkan Worker ID atau NIK..."
                            value={workerId}
                            onChange={(e) => setWorkerId(e.target.value)}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                        {/* Inline error for this field */}
                        {errors.workerId && (
                            <p className="mt-1 text-sm text-danger">{errors.workerId}</p>
                        )}
                    </div>

                    {/* ── Date ──────────────────────────────────────────────── */}
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                            Tanggal Lembur
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                        {errors.date && (
                            <p className="mt-1 text-sm text-danger">{errors.date}</p>
                        )}
                    </div>

                    {/* ── Hours ─────────────────────────────────────────────── */}
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                            Jam Lembur (1 – 6)
                        </label>
                        <input
                            type="number"
                            placeholder="Contoh: 2"
                            value={hours}
                            min={1}
                            max={6}
                            onChange={(e) => setHours(e.target.value)}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                        {errors.hours && (
                            <p className="mt-1 text-sm text-danger">{errors.hours}</p>
                        )}
                    </div>

                    {/* ── Reason ────────────────────────────────────────────── */}
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                            Alasan Lembur
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Jelaskan alasan lembur (minimal 10 karakter)..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary resize-none"
                        />
                        {/* Character counter helps user know if they've hit 10 chars */}
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {reason.trim().length} / minimal 10 karakter
                        </p>
                        {errors.reason && (
                            <p className="mt-1 text-sm text-danger">{errors.reason}</p>
                        )}
                    </div>

                    {/* ── Action buttons ────────────────────────────────────── */}
                    <div className="flex flex-col md:flex-row gap-3">
                        <ButtonOne type="submit" disabled={loading}>
                            <span>{loading ? 'Menyimpan...' : 'Simpan'}</span>
                        </ButtonOne>
                        <Link to="/data-lembur">
                            <ButtonTwo>
                                <span>Kembali</span>
                            </ButtonTwo>
                        </Link>
                    </div>

                </form>
            </div>
        </Layout>
    );
};

export default FormAddDataLembur;
