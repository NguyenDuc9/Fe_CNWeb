import Image from 'next/image';
const products = [
  {
    id: 1,
    name: 'Iphone 15',
    price: 1200,
    img: '/public/img-1.png',
  },
  {
    id: 2,
    name: 'Samsung S24',
    price: 1100,
    img: '/public/img-1.png',
  },
  {
    id: 3,
    name: 'Xiaomi 14',
    price: 900,
    img: 'https://via.placeholder.com/200',
  },
  {
    id: 4,
    name: 'Macbook Air',
    price: 1500,
    img: 'https://via.placeholder.com/200',
  },
  {
    id: 5,
    name: 'Dell XPS',
    price: 1400,
    img: 'https://via.placeholder.com/200',
  },
  {
    id: 6,
    name: 'HP Spectre',
    price: 1300,
    img: 'https://via.placeholder.com/200',
  },
  {
    id: 7,
    name: 'iPad Pro',
    price: 1000,
    img: 'https://via.placeholder.com/200',
  },
  {
    id: 8,
    name: 'Galaxy Tab',
    price: 850,
    img: 'https://via.placeholder.com/200',
  },
  {
    id: 9,
    name: 'AirPods Pro',
    price: 250,
    img: 'https://via.placeholder.com/200',
  },
];

export default function ProductList() {
  return (
    <div style={{ padding: '40px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Danh sách sản phẩm
      </h2>

      <div style={gridStyle}>
        {products.map((product) => (
          <div key={product.id}>
            <img src={product.img} alt={product.name} style={imageStyle} />
            <h3>{product.name}</h3>
            <p style={{ color: 'red', fontWeight: 'bold' }}>${product.price}</p>
            <button style={buttonStyle}>Mua ngay</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
};

const cardStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  textAlign: 'center',
};

const imageStyle = {
  width: '100%',
  borderRadius: '8px',
};

const buttonStyle = {
  marginTop: '10px',
  padding: '10px 15px',
  background: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};
