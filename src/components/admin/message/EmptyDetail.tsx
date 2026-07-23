const EmptyDetail: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <div className="text-5xl text-slate-300 mb-3">💬</div>
    <p className="text-sm font-medium text-slate-400 m-0">
      Nothing is highlighted as you have chosen conversation
    </p>
    <p className="text-xs text-slate-300 mt-1.5">
      Select a message from the list to view its content
    </p>
  </div>
);

export default EmptyDetail;
