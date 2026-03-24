// import { useEffect, useState } from "react";

// function FlagGame() {
//     const [countries, setCountries] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetch('https://localhost:8081/api/countries')
//         .then(res => res.json())
//         .then(data => {
//             setCountries(data);
//             setLoading(false);
//         })
//         .catch(err => console.error("Błąd: ", err));
//     }, []);

//     if (loading) return <p>Ładowanie...</p>;

//     return (
//         <div style={{ padding: '20px'}}>
//             <h2>Wybierz flagę:</h2>
//         <div style={{
//             maxHeight: '70vh',
//             overflow: 'auto',
//             padding: '15px'
//         }}>
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center'}}>
//                 {countries.map((country) => (
//                     <div key={country.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px'}}>
//                         <img
//                             src={country.flagUrl}
//                             alt={country.name}
//                             style={{ width: '200px', height: '120px', objectFit: 'cover', display: 'block', marginBottom: '10px'}}
//                         />
//                         <p><strong>{country.name}</strong></p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     </div>
//     );
// }

// export default FlagGame;