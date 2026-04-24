import { useEffect, useState } from "react";

const CarParts = () => {
  // 1. IMPORTANTE: Inicializar siempre como un array vacío []
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // 3. CAMBIO AQUÍ: Validación de seguridad antes de hacer el slice
  // Esto evita el error "parts.map is not a function"
  const displayedParts = Array.isArray(parts) ? parts.slice(0, visibleCount) : [];

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <section id="parts">
      <h2>Listado de Repuestos</h2>
      
      <div className="carparts-grid">
        {/* 4. CAMBIO AQUÍ: Usar displayedParts que ya está validado */}
        {displayedParts.length > 0 ? (
          displayedParts.map((item) => (
            <div key={item.articleId} className="part-card">
              <div className="part-image-placeholder">
                 <img 
                   src={item.s3image} 
                   alt={item.articleProductName} 
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                   onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Sin+Imagen'; }}
                 />
              </div>
              <div className="part-details">
                <h3>{item.articleProductName}</h3>
                <p><strong>Proveedor:</strong> {item.supplierName}</p>
                <p className="price">ID: {item.articleId}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No se encontraron repuestos.</p>
        )}
      </div>

      {parts.length > 10 && visibleCount < parts.length && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <button className="cta-button" onClick={() => setVisibleCount(prev => prev + 10)}>
            Ver más
          </button>
        </div>
      )}
    </section>
  );
};

export default CarParts;