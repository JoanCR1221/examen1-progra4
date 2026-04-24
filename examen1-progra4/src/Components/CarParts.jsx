import { useEffect, useState } from "react";

const CarParts = () => {
  // 1. IMPORTANTE: Inicializar siempre como un array vacío []
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleCount, setVisibleCount] = useState(10);
 

  const API_URL = "https://api.jsonbin.io/v3/b/69e535e236566621a8ce210a";
  const API_KEY = "$2a$10$7L0fDBh3v77EF1usWl4EfOwXzcST0EFg9vISOOTUPBq7xcutgDBU2";

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: { 'X-Access-Key': API_KEY }
        });

        if (!response.ok) throw new Error("Error en la petición");

        const data = await response.json();
        
        // 2. CAMBIO AQUÍ: Asegurar que entramos a record.articles
        // El operador || [] asegura que si algo falla, siga siendo un array
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
  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;


 return (
  <section id="parts">
    <h2>Listado de Repuestos</h2>

    <div className="search-container" style={{ marginBottom: '2rem', textAlign: 'center' }}>
      <input 
        type="text" 
        placeholder="Buscar por nombre de repuesto..." 
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setVisibleCount(10); // Reiniciamos la paginación al buscar
        }}
        className="search-input"
        style={{
          padding: '10px',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '8px',
          border: '1px solid #ccc'
        }}
      />
    </div>

    <div className="carparts-grid">
        {displayedParts.length > 0 ? (
          displayedParts.map((item) => (
            <div key={item.articleId} className="part-card">
              <div className="part-image-placeholder">
                 <img 
                   src={item.s3image} 
                   alt={item.articleProductName} 
                   style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                   onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=Sin+Imagen'; }}
                 />
              </div>
              <div className="part-details" style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>{item.articleProductName}</h3>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>Proveedor: {item.supplierName}</p>
                <p style={{ fontWeight: 'bold', color: '#1a237e' }}>ID: {item.articleId}</p>
              </div>
            </div>
          ))
        ): (
        <p>No se encontraron resultados para "{searchTerm}"</p>
      )}
    </div>
    
    {/* El botón "Ver más" ahora debe depender de filteredParts */}
    {filteredParts.length > visibleCount && (
      <button onClick={() => setVisibleCount(prev => prev + 10)}>
        Ver más
      </button>
    )}
  </section>
);
};

export default CarParts;