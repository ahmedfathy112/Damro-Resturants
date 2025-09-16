const PlaceholderTab = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
      <Icon size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default PlaceholderTab;
