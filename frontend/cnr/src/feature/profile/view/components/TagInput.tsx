import { useState, KeyboardEvent, ChangeEvent, useEffect } from "react";
import { User } from "../../../../core/dtos/data";
import { BsXLg } from "react-icons/bs";

interface TagInputProps {
  userList: User[];
  onTagsChange: (userIds: string[]) => void; // Callback to update parent state
}

const TagInput: React.FC<TagInputProps> = ({ userList, onTagsChange }) => {
  const [selectedTags, setSelectedTags] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  useEffect(() => {
    if (userList.length === 0) {
      setSelectedTags([]); // Clear selected tags
      onTagsChange([]); // Notify parent that tagged users are now empty
    }
  }, [userList, onTagsChange]);

  const addTag = (user: User) => {
    if (!selectedTags.some((tag) => tag.id === user.id)) {
      const updatedTags = [...selectedTags, user];
      setSelectedTags(updatedTags);
      onTagsChange(updatedTags.map((tag) => tag.id)); // Update parent with user IDs
    }
    setInputValue("");
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const removeLastTag = () => {
    if (selectedTags.length > 0) {
      const updatedTags = selectedTags.slice(0, -1); // Remove last element
      setSelectedTags(updatedTags);
      onTagsChange(updatedTags.map((tag) => tag.id)); // Update parent with user IDs
    }
  };

  const removeTag = (index: number) => {
    const updatedTags = selectedTags.filter((_, i) => i !== index);
    setSelectedTags(updatedTags);
    onTagsChange(updatedTags.map((tag) => tag.id)); // Update parent with user IDs
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      const trimmedValue = inputValue.trim().toLowerCase();

      if (trimmedValue === "@toutes") {
        const newUsers = userList.filter(
          (user) => !selectedTags.some((tag) => tag.id === user.id)
        );
        if (newUsers.length > 0) {
          const updatedTags = [...selectedTags, ...newUsers];
          setSelectedTags(updatedTags);
          onTagsChange(updatedTags.map((tag) => tag.id));
        }
      } else if (activeIndex >= 0 && filteredSuggestions[activeIndex]) {
        addTag(filteredSuggestions[activeIndex]);
      } else {
        const user = userList.find(
          (u) => u.username.toLowerCase() === trimmedValue.slice(1)
        );
        if (user) addTag(user);
      }

      setInputValue("");
      setShowSuggestions(false);
      setActiveIndex(-1);
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      selectedTags.length > 0
    ) {
      e.preventDefault(); // Prevent browser navigating back
      removeLastTag();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.startsWith("@")) {
      if (value.toLowerCase() === "@toutes") {
        setFilteredSuggestions([]); // Hide suggestions when selecting all
        setShowSuggestions(false);
      } else {
        const filtered =
          value.length > 1
            ? userList.filter((user) =>
                user.username
                  .toLowerCase()
                  .includes(value.toLowerCase().slice(1))
              )
            : userList;

        setFilteredSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
        setActiveIndex(-1);
      }
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (user: User) => {
    addTag(user);
  };

  return (
    <div className="flex flex-col w-full max-w-lg">
      <div className="flex flex-wrap items-center gap-1 p-2 border border-gray-300 rounded-lg bg-base-100 shadow-md">
        {selectedTags.map((tag, index) => (
          <span
            key={tag.id}
            className="badge-primary font-bold text-sm px-2 py-1 rounded-full flex items-center gap-1"
          >
            {tag.username} - {tag.workAt} / {tag.wilaya}
            <BsXLg
              className="cursor-pointer hover:text-red-500"
              onClick={() => removeTag(index)}
              size={12}
            />
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="@username or @toutes"
          className="flex-1 px-2 py-1 text-sm border-none focus:outline-none"
          onFocus={() => setShowSuggestions(inputValue.startsWith("@"))}
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="menu bg-base-100 w-full border border-gray-200 rounded-md mt-2 shadow-lg transition-all duration-200">
          {filteredSuggestions.map((user, index) => (
            <li
              key={user.id}
              className={`p-2 cursor-pointer transition-all duration-150 ${
                index === activeIndex
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleSuggestionClick(user)}
            >
              <span className="font-semibold ">
                {user.username} - {user.workAt} / {user.wilaya}
              </span>
            </li>
          ))}
        </ul>
      )}
      <em className="text-xs text-gray-500 mt-2">
        Commencez par <b>@</b> pour voir les suggestions. <br></br>Tapez{" "}
        <b>@toutes</b> pour mentionner tous les utilisateurs.
      </em>
    </div>
  );
};

export default TagInput;
