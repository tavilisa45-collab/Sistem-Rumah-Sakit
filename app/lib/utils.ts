/* eslint-disable @typescript-eslint/no-explicit-any */
export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(value);
};

export const calculateBMI = (height: number, weight: number): number => {
  return parseFloat((weight / (height / 100) ** 2).toFixed(1));
};

export const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    MASUK: 'bg-green-100 text-green-800',
    PULANG: 'bg-primary-100 text-primary-800',
    MENINGGAL: 'bg-red-100 text-red-800',
    LARI: 'bg-yellow-100 text-yellow-800',
    PENDING: 'bg-gray-100 text-gray-800',
    SELESAI: 'bg-green-100 text-green-800',
    DISETUJUI: 'bg-green-100 text-green-800',
    DITOLAK: 'bg-red-100 text-red-800',
    PROSES: 'bg-primary-100 text-primary-800',
  };

  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getRoleLabel = (role: string): string => {
  const labels: { [key: string]: string } = {
    ADMIN: 'Administrator',
    DOKTER: 'Dokter',
    FARMASI: 'Apoteker Farmasi',
    LAB: 'Petugas Laboratorium',
    RADIOLOGI: 'Petugas Radiologi',
    RAWAT_INAP: 'Petugas Rawat Inap',
    LOGISTIK: 'Petugas Logistik',
    PERAWAT: 'Perawat',
    RESEPSIONIS: 'Resepsionis',
  };

  return labels[role] || role;
};

export const generatePDF = async (content: string, filename: string) => {
  try {
    const { jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');

    const element = document.getElementById(content);
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const doc = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export const exportToCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};
