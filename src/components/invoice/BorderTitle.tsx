interface Props {
  title: string;
}
const BorderTitle: React.FC<Props> = ({ title }) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 rounded-full bg-[#FF8B5A]" />

        <h2 className="text-lg sm:text-[22px] font-bold text-[#294566]">
          {title}
        </h2>
      </div>
    </div>
  );
};

export default BorderTitle;
