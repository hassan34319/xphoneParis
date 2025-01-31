const livraison = () => {
    return (
      <div className="mx-auto w-11/12 max-w-3xl rounded my-4 p-4 font-sans text-center">
        <div className="mb-6">
          <h1 className="text-lg lg:text-xl font-extrabold m-4">Dans quels pays faites-vous les livraisons ?</h1>
          <p>
            <strong>Text:</strong> Nous assurons la livraison dans plusieurs pays, notamment en France, en Belgique et en Suisse.
            Chaque colis est soigneusement emballé pour garantir son intégrité lors de la livraison. Votre satisfaction reste notre priorité essentielle.
          </p>
        </div>
  
        <div className="mb-6">
          <h1 className="text-lg font-extrabold m-4 lg:text-xl">Quels sont les délais de livraison chez XPhones ?</h1>
          <p>Le délai de livraison est estimé à 24h.</p>
        </div>
  
        <div className="mb-6">
          <h1 className="text-lg font-extrabold m-4 lg:text-xl">Comment puis-je contacter la société XPhones ?</h1>
          <p>
            Pour contacter la société XPhones, plusieurs options s'offrent à vous : vous pouvez nous envoyer un email à l'adresse
            <a href="mailto:contact@xphones.fr" className="text-blue-600 font-bold"> contact@xphones.fr </a> 
            ou nous appeler aux numéros suivants : 01 45 45 13 63 ou 01 42 77 13 63.
          </p>
        </div>
      </div>
    );
  };
  
  export default livraison;
  