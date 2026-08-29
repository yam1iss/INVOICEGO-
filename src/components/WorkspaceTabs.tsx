type WorkspaceView = "edit" | "preview";

type WorkspaceTabsProps = {
  view: WorkspaceView;
  onChange: (view: WorkspaceView) => void;
};

export function WorkspaceTabs({ view, onChange }: WorkspaceTabsProps) {
  return (
    <div
      data-print-hide
      className="print:hidden shrink-0 border-b border-line bg-paper px-3 py-2 sm:px-4 lg:hidden"
    >
      <div
        role="tablist"
        aria-label="Workspace"
        className="grid grid-cols-2 gap-1 rounded-[2px] bg-field p-1"
      >
        <TabButton
          selected={view === "edit"}
          onClick={() => onChange("edit")}
        >
          Edit
        </TabButton>
        <TabButton
          selected={view === "preview"}
          onClick={() => onChange("preview")}
        >
          Preview
        </TabButton>
      </div>
    </div>
  );
}

function TabButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={`min-h-10 rounded-[2px] text-sm font-semibold tracking-tight touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
        selected
          ? "bg-paper text-ink shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "bg-transparent text-ink-muted"
      }`}
    >
      {children}
    </button>
  );
}
