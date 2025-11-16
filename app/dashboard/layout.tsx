'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface User {
  id: string;
  nama: string;
  email: string;
  role: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserInfo();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: '',
      roles: ['ADMIN', 'DOKTER', 'FARMASI', 'LAB', 'RAWAT_INAP', 'LOGISTIK'],
    },
    {
      label: 'Pasien',
      href: '/dashboard/pasien',
      icon: '',
      roles: ['ADMIN', 'RESEPSIONIS', 'DOKTER', 'PERAWAT'],
    },
    {
      label: 'Dokter & Jadwal',
      href: '/dashboard/dokter',
      icon: '',
      roles: ['ADMIN', 'RESEPSIONIS'],
    },
    {
      label: 'Farmasi',
      href: '/dashboard/farmasi',
      icon: '',
      roles: ['ADMIN', 'FARMASI', 'DOKTER'],
    },
    {
      label: 'Laboratorium',
      href: '/dashboard/lab',
      icon: '',
      roles: ['ADMIN', 'LAB', 'DOKTER'],
    },
    {
      label: 'Rawat Inap',
      href: '/dashboard/rawat-inap',
      icon: '',
      roles: ['ADMIN', 'RAWAT_INAP', 'PERAWAT', 'DOKTER'],
    },
    {
      label: 'Inventory',
      href: '/dashboard/inventory',
      icon: '',
      roles: ['ADMIN', 'LOGISTIK'],
    },
    {
      label: 'Laporan',
      href: '/dashboard/laporan',
      icon: '',
      roles: ['ADMIN', 'DOKTER'],
    },
  ];
  const visibleMenus = menuItems.filter((item) =>
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-primary-900 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div>
                <div className="font-semibold">NARAHUBUNG</div>
                <div className="text-xs opacity-90">(+628) 123-4567</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div>
                <div className="font-semibold">JAM KERJA</div>
                <div className="text-xs opacity-90">24/7 - Setiap Hari</div>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <div>
                <div className="font-semibold">LOKASI</div>
                <div className="text-xs opacity-90">Mataram, NTB</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs hidden sm:inline">{user?.nama}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-white text-primary-600 rounded text-xs font-medium hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-primary-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >
              <div className="bg-white p-2 rounded">
                <svg
                  className="w-4 h-4 primary-text"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.5 22L1.25192 18.6279C1.08766 18.3815 1 18.092 1 17.7958V13.25C1 12.5596 1.55964 12 2.25 12C2.94036 12 3.5 12.5596 3.5 13.25V16.0211C3.5 16.1162 3.52712 16.2093 3.57817 16.2895L3.79872 16.6361M5.44444 19.2222L3.79872 16.6361M8.22222 21.9999V19.4235C8.22222 18.93 8.07612 18.4474 7.80234 18.0368L6.79337 16.5233C6.34922 15.8571 5.46013 15.6572 4.77355 16.0691L3.79872 16.6361M20.7223 22L22.782 18.6088C22.9246 18.3741 23 18.1048 23 17.8301V13.2499C23 12.5596 22.4404 12 21.7501 12C21.0598 12 20.5001 12.5596 20.5001 13.2499V16.0211C20.5001 16.1162 20.473 16.2093 20.422 16.2895L20.4166 16.298M18.5557 19.2222L20.4166 16.298M16 22V19.0903C16 18.5967 16.1461 18.1142 16.4199 17.7035L17.4289 16.1901C17.873 15.5238 18.7621 15.3239 19.4487 15.7359L20.4166 16.298M12.9999 2C13.5521 2 13.9999 2.44772 13.9999 3V5.90014C13.9999 5.95536 14.0446 6.00013 14.0999 6.00013L17 6.00014C17.5523 6.00014 18 6.44785 18 7.00014V9.00013C18 9.55242 17.5523 10.0001 17 10.0001H14.0999C14.0446 10.0001 13.9999 10.0449 13.9999 10.1001V13C13.9999 13.5523 13.5521 14 12.9999 14H10.9999C10.4476 14 9.99985 13.5523 9.99985 13V10.1001C9.99985 10.0449 9.95508 10.0001 9.89985 10.0001H7.00005C6.44776 10.0001 6.00005 9.55242 6.00005 9.00013V7.00013C6.00005 6.44785 6.44776 6.00013 7.00005 6.00013L9.89985 6.00013C9.95508 6.00013 9.99985 5.95536 9.99985 5.90014V3C9.99985 2.44771 10.4476 2 10.9999 2H12.9999Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">MEDIS</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {visibleMenus.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium transition rounded ${
                      isActive
                        ? 'text-white bg-primary-700'
                        : 'text-gray-300 hover:text-white hover:bg-primary-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-primary-800 rounded"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-primary-800">
              {visibleMenus.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'text-white bg-primary-700'
                        : 'text-gray-300 hover:text-white hover:bg-primary-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>

      <footer className="bg-primary-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white p-2 rounded">
                  <svg
                    className="w-4 h-4 primary-text"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.5 22L1.25192 18.6279C1.08766 18.3815 1 18.092 1 17.7958V13.25C1 12.5596 1.55964 12 2.25 12C2.94036 12 3.5 12.5596 3.5 13.25V16.0211C3.5 16.1162 3.52712 16.2093 3.57817 16.2895L3.79872 16.6361M5.44444 19.2222L3.79872 16.6361M8.22222 21.9999V19.4235C8.22222 18.93 8.07612 18.4474 7.80234 18.0368L6.79337 16.5233C6.34922 15.8571 5.46013 15.6572 4.77355 16.0691L3.79872 16.6361M20.7223 22L22.782 18.6088C22.9246 18.3741 23 18.1048 23 17.8301V13.2499C23 12.5596 22.4404 12 21.7501 12C21.0598 12 20.5001 12.5596 20.5001 13.2499V16.0211C20.5001 16.1162 20.473 16.2093 20.422 16.2895L20.4166 16.298M18.5557 19.2222L20.4166 16.298M16 22V19.0903C16 18.5967 16.1461 18.1142 16.4199 17.7035L17.4289 16.1901C17.873 15.5238 18.7621 15.3239 19.4487 15.7359L20.4166 16.298M12.9999 2C13.5521 2 13.9999 2.44772 13.9999 3V5.90014C13.9999 5.95536 14.0446 6.00013 14.0999 6.00013L17 6.00014C17.5523 6.00014 18 6.44785 18 7.00014V9.00013C18 9.55242 17.5523 10.0001 17 10.0001H14.0999C14.0446 10.0001 13.9999 10.0449 13.9999 10.1001V13C13.9999 13.5523 13.5521 14 12.9999 14H10.9999C10.4476 14 9.99985 13.5523 9.99985 13V10.1001C9.99985 10.0449 9.95508 10.0001 9.89985 10.0001H7.00005C6.44776 10.0001 6.00005 9.55242 6.00005 9.00013V7.00013C6.00005 6.44785 6.44776 6.00013 7.00005 6.00013L9.89985 6.00013C9.95508 6.00013 9.99985 5.95536 9.99985 5.90014V3C9.99985 2.44771 10.4476 2 10.9999 2H12.9999Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <span className="text-2xl font-bold">MEDIS</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Leading the Way in Medical Excellence. Trusted Care.
              </p>
            </div>

            {/* <div>
              <h3 className="font-bold mb-4">Important Links</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition"
                  >
                    Appointment
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition"
                  >
                    Doctors
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white transition"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div> */}

            <div>
              <h3 className="font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Address: Jl. Pemuda, Kec. Selaparang</li>
                <li>Mataram, NTB</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Newsletter</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 rounded text-sm text-gray-900"
                />
                <button className="px-4 py-2 bg-white text-primary-900 rounded hover:bg-gray-100 transition">
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              © 2025 Rumah Sakit Hermawati. All Rights Reserved by Hermawati
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a
                href="#"
                className="hover:text-white transition"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="hover:text-white transition"
              >
                Facebook
              </a>
              <a
                href="#"
                className="hover:text-white transition"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
