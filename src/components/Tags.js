import { useEffect, useState } from "react";
import { Tag, Input, Space, Divider, Button } from "antd";

function Tags({ addTags, isEditable, setUpdateTodoList, value = [] }) {
	const [tags, setTags] = useState([]);
	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		if (isEditable) {
			setTags(value);
		}
	}, [value]);

	const handleInputChange = (event) => {
		setInputValue(event.target.value);
	};

	const handleInputConfirm = () => {
		if (inputValue && tags.indexOf(inputValue) === -1) {
			setTags([...tags, inputValue]);

			if (isEditable) {
				setUpdateTodoList((pre) => {
					return { ...pre, tags: [...tags, inputValue] };
				});
			} else {
				addTags([...tags, inputValue]);
			}
		}
		setInputValue("");
	};

	const handleTagClose = (removedTag) => {
		const newTags = tags.filter((tag) => tag !== removedTag);
		setTags(newTags);
		if (isEditable) {
			setUpdateTodoList((pre) => {
				return { ...pre, tags: [...newTags] };
			});
		} else {
			addTags([newTags]);
		}
	};

	return (
		<div>
			<span>Tags</span>
			<Input
				style={{
					width: "30%",
					marginLeft: "1rem",
				}}
				type="text"
				value={inputValue}
				onChange={handleInputChange}
			/>

			<Button
				onClick={handleInputConfirm}
				style={{
					marginLeft: "0.3rem",
				}}
				type="primary"
				ghost
			>
				Click
			</Button>

			<br />
			<Divider orientation="left">Tags</Divider>
			<Space size={[0, 8]} wrap>
				{tags.map((tag) => (
					<Tag key={tag} closable onClose={() => handleTagClose(tag)}>
						{tag}
					</Tag>
				))}
			</Space>
		</div>
	);
}

export default Tags;
