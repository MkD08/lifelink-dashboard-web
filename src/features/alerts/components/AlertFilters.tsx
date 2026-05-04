interface Props {
    search: string;
    setSearch: (v: string) => void;
    filter: string;
    setFilter: (v: string) => void;
  }
  
  export default function AlertsFilters({
    search,
    setSearch,
    filter,
    setFilter,
  }: Props) {
    return (
      <div className="flex gap-3">
  
        <input
          className="border p-2 rounded-xl flex-1"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
  
        <select
          className="border p-2 rounded-xl"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tous</option>
          <option value="urgent">Urgent</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
  
      </div>
    );
  }