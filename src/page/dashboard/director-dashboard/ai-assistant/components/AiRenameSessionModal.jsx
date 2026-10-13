import { Modal } from "antd";
import { useForm } from "react-hook-form";
import { useRenameAiSession } from "@/hooks/api/director-hooks/useAiChat";
import { aiErrorMessage } from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiChat";
import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";

export default function AiRenameSessionModal({ session, onClose, onRenamed }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { title: session.title || "" } });
  const mutation = useRenameAiSession();
  return (
    <Modal
      title="Rename conversation"
      open
      onCancel={() => {
        if (!mutation.isPending) onClose();
      }}
      footer={null}
      closable={!mutation.isPending}
      maskClosable={!mutation.isPending}
      keyboard={!mutation.isPending}
    >
      <form
        onSubmit={handleSubmit(({ title }) =>
          mutation.mutate(
            { sessionUuid: session.session_uuid, title: title.trim() },
            { onSuccess: () => onRenamed(title.trim()) },
          ),
        )}
        className="space-y-4 pt-3"
      >
        <CommonInputWrapper
          label="Conversation title"
          register_as="title"
          register={register}
          errors={errors}
          validationRules={{
            validate: (value) =>
              Boolean(value.trim()) || "Enter a conversation title.",
          }}
        />
        {mutation.isError && (
          <p role="alert" className="text-sm text-red-700">
            {aiErrorMessage(mutation.error, "Unable to rename conversation.")}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <CommonSubmitBtn
            type="button"
            variant="secondary"
            disabled={mutation.isPending}
            onClick={onClose}
          >
            Cancel
          </CommonSubmitBtn>
          <CommonSubmitBtn isLoading={mutation.isPending}>
            Save title
          </CommonSubmitBtn>
        </div>
      </form>
    </Modal>
  );
}
