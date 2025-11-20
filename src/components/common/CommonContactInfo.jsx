import Icon from "./Icon";

export default function CommonContactInfo({icon, label, info}) {
  return (
    <div className="flex gap-3 items-center">
      <div className="bg-[#E6F7FD] p-2 rounded-full w-fit">
        <Icon src={icon} className="size-5" />
      </div>
      <div>
        <p className="text-[14px] text-[#666666]">{label}</p>
        <p className="text-base font-normal">{info}</p>
      </div>
    </div>
  );
}
