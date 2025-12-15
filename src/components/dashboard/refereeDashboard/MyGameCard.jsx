import location from "@/assets/svg/location.svg";
import Icon from "@/components/common/Icon";
import message from "@/assets/svg/message.svg";
import { Divider, Image } from "antd";

export default function MyGameCard({ game }) {
  return (
    <div className="border border-border rounded-[10px] mb-5">
      <p className="block md:hidden w-fit mx-auto mt-4 text-base font-medium  text-primary border border-primary py-2.5 px-3 bg-[#E6F7FD] rounded-md">
        {game.court}
      </p>
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-2.5">
          <Icon src={location} className="size-5 text-primary" />
          <p>{game.time}</p>
        </div>
        <p className="hidden md:block text-base font-medium  text-primary border border-primary py-2.5 px-3 bg-[#E6F7FD] rounded-md">
          {game.court}
        </p>
        <button className="bg-primary p-3.5 rounded-[10px] cursor-pointer">
          <Icon src={message} className="size-5 text-white" />
        </button>
      </div>
      <Divider className="my-0!" />
      <div className="p-5">
        {game.refree.map((ref, index) => (
          <div key={index} className="flex items-center gap-1.5 mb-2">
            <Image
              src={ref.image}
              alt="game image"
              width={60}
              height={60}
              className="rounded-full"
            />
            <div>
              <p className="text-lg">{ref.name}</p>
              <p className="text-primary">{ref.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
