import { useEffect, useState } from "react";

const CarParts = () => {
  // --- ESTADOS (Paso 5 y 6) ---
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [visibleCount, setVisibleCount] = useState(10); // Control de paginación (Paso 4)

  // Datos de la API proporcionados en el examen
  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: { 'X-Access-Key': API_KEY }
        });

        if (!response.ok) throw new Error("Error al cargar los datos de la API");

        const data = await response.json();
        // Accedemos a la ruta exacta: record -> articles
        setParts(data?.record?.articles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredParts = parts.filter(part => 
    part.articleProductName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedParts = filteredParts.slice(0, visibleCount);

 
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'white' }}>
        <div className="spinner"></div>
        <p>Cargando repuestos desde la API...</p>
      </div>
    );
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>Error: {error}</div>;
  }

  return (
    <section id="parts" style={{ padding: '2rem', color: 'white' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: '#aaa', fontSize: '0.8rem', textTransform: 'uppercase' }}>Catálogo</p>
        <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>Repuestos</h2>
        <p style={{ color: '#888' }}>Mostrando {displayedParts.length} de {filteredParts.length} artículos</p>
      </header>

   
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <input 
          type="text" 
          placeholder="Buscar por nombre o código..." 
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setVisibleCount(10); // Reiniciar a 10 al buscar
          }}
          style={{
            width: '100%',
            maxWidth: '500px',
            padding: '12px 20px',
            borderRadius: '8px',
            border: '1px solid #333',
            backgroundColor: '#1a1a1a',
            color: 'white',
            fontSize: '1rem'
          }}
        />
      </div>

      <div className="carparts-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        {displayedParts.length > 0 ? (
          displayedParts.map((item) => (
            <div key={item.articleId} className="part-card" style={{
              backgroundColor: '#1e1e26',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
    
              <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
                <img 
                  src={item.s3image} 
                  alt={item.articleProductName} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', // Mantiene proporción sin estirar
                    objectPosition: 'center' 
                  }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                />
              </div>

              <div style={{ padding: '1.2rem' }}>
                <p style={{ color: '#666', fontSize: '0.75rem', marginBottom: '0.3rem' }}>{item.articleProductName.toUpperCase()}</p>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>{item.articleProductName}</h3>
                <p style={{ fontSize: '0.85rem', color: '#aaa', margin: '4px 0' }}>{item.articleNo}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>{item.supplierName}</span>
                  <span style={{ color: '#7e57c2', fontWeight: 'bold' }}>#{item.supplierId}</span>
                </div>
                <p style={{ color: '#3f51b5', fontWeight: 'bold', marginTop: '10px' }}>ID: {item.articleId}</p>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <p>No se encontraron repuestos que coincidan con su búsqueda.</p>
          </div>
        )}
      </div>

     
      {filteredParts.length > visibleCount && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <button 
            className="cta-button" 
            onClick={() => setVisibleCount(prev => prev + 10)}
            style={{
              padding: '12px 30px',
              backgroundColor: '#31313f',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Ver más
          </button>
        </div>
      )}
    </section>
  );
};

export default CarParts;