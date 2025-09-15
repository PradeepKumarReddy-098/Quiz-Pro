import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';

const CertificatePage = () => {
  const { resultId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const token = localStorage.getItem('Quizz-Pro');
        const response = await fetch(`http://localhost:3001/api/quiz/certificate/${resultId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch certificate');

        const blob = await response.blob();
        //console.log(blob)
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error(error);
        alert('Error loading certificate');
      }
    };

    fetchCertificate();

    
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [resultId]);

  if (!pdfUrl) return <p>Loading certificate...</p>;

  return (
    <>
    <Navbar></Navbar>
    <div style={{ maxWidth: 800, margin: 'auto', textAlign: 'center' }}>
      <h2>Your Certificate</h2>
      <iframe
        src={pdfUrl}
        title="Certificate"
        width="100%"
        height="600px"
        style={{ border: '1px solid #ccc', borderRadius: '8px' }}
      />
      <button
        onClick={() => {
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = `certificate_${resultId}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        style={{ marginTop: 20, padding: '10px 20px', cursor: 'pointer' }}
      >
        Download Certificate
      </button>
    </div>
    </>
  );
};

export default CertificatePage;
