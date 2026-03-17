import { useForm, type SubmitHandler } from "react-hook-form";
import type { createChat } from "../../types/chat";
import { X } from "lucide-react";
import { useCreateChatMutation } from "../../store/api/chatApi";
import { useAppDispatch } from "../hooks/hooks";
import { setChatId } from "../../store/slices/chatIdSlice";
import { toast } from "react-toastify";
const CreateChat = ({
  setIsCreatingChat,
}: {
  setIsCreatingChat: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { register, handleSubmit, reset } = useForm<createChat>({
    defaultValues: {
      title: "New Chat",
    },
  });
  const [createChat] = useCreateChatMutation();
  const dispatch = useAppDispatch();
  const createChatHandler: SubmitHandler<createChat> = async (data) => {
    try {
      const result = await createChat(data).unwrap();
      toast.success(result.message);
      dispatch(setChatId(result.chat._id));
      setIsCreatingChat(false);
    } catch (err) {
      toast.error("Some error occured while creating chat");
      console.log(err);
    } finally {
      reset();
    }
  };
  return (
    <div
      className="absolute min-h-fit h-screen z-60 bg-secondary-background  inset-0 flex justify-center items-center overflow-y-auto "
      onClick={() => {
        setIsCreatingChat(false);
      }}
    >
      <div
        className="border border-primary  py-5 px-10 rounded-md "
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex justify-end items-center mb-10  relative">
          <X
            className="hover:scale-110 relative active:scale-95 hover:cursor-pointer transition-all -right-5"
            size={20}
            onClick={() => {
              setIsCreatingChat(false);
            }}
          />
        </div>
        <form
          onSubmit={handleSubmit(createChatHandler)}
          className="flex flex-col gap-10 text-[.8rem] lg:text-[.7rem] "
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="lg:text-[.6rem]">
              Enter Chat Title
            </label>
            <input
              type="text"
              {...register("title", { maxLength: 30 })}
              className=" p-1 border-b border-primary "
            />
          </div>
          <button
            type="submit"
            className="p-2 rounded-xl border border-primary lg:text-[.6rem] duration-100 active:scale-90 hover:scale-105"
          >
            Create Chat
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateChat;
