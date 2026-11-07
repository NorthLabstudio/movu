import './NewsCards.css';

function NewsCard({ novedad }) {

  // Formatear la fecha de inicio
  function formatearFecha(fecha) {
    if (!fecha) return 'Fecha no disponible';

    const fechaConvertida = new Date(fecha);

    if (Number.isNaN(fechaConvertida.getTime())) {
      return 'Fecha no disponible';
    }

    return fechaConvertida.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  return (
    <article className="news-item">
      <span className="news-title">
        {novedad.titulo}
      </span>

      <span className="news-type">
        {novedad.tipo}
      </span>

      <span className="news-date">
        Desde: {formatearFecha(novedad.fechaInicio)}
      </span>

      <span className="news-description">
        {novedad.descripcion}
      </span>
    </article>
  );
}

export default NewsCard;