import './App.css';
import { Button, Modal, Input, Tag, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { DatePicker, Space, Select, Form } from 'antd';
import moment from 'moment';
import dayjs from 'dayjs';
import axios from 'axios';
import Tags from './components/Tags';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDataSourcee,
  addTodo,
  deleteTodo,
  updateTodo,
} from './reducers/todoReducer';
const { TextArea } = Input;

function App() {
  const dispatch = useDispatch();
  const dataSourcee = useSelector((state) => state.todos.dataSourcee);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isForm, setisForm] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [tags, setTags] = useState([]);
  const [states, setStates] = useState('open');
  const [searchText, setSearchText] = useState('');
  const [optionsTag, setoptionsTag] = useState([]);
  const [filtereData, setfiltereData] = useState(dataSourcee);

  useEffect(() => {
    setfiltereData(dataSourcee);
  }, [dataSourcee]);

  useEffect(() => {
    let option = [];
    filtereData.forEach((item) => {
      item.tags.forEach((tag) => {
        let check = true;
        if (option.length === 0) {
          option.push({ text: tag, value: tag });
        } else {
          option.forEach((textTag) => {
            if (textTag?.text === tag) {
              check = false;
            }
          });
          if (check) {
            option.push({ text: tag, value: tag });
          }
        }
      });
    });
    setoptionsTag(option);
  }, [filtereData]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          'https://63edcd385e9f1583bdb63e22.mockapi.io/datas'
        );
        dispatch(setDataSourcee(response.data));
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [dispatch]);

  const columns = [
    {
      key: '1',
      title: 'S. No.',
      dataIndex: 'serialNo',
      render: (text, record, index) => index + 1,
    },
    {
      key: '2',
      title: 'Timestamp created',
      dataIndex: 'timeStampCreated',
      render: (date) => moment(date).format('DD/MM/YY'),
      sorter: (a, b) =>
        moment(a.timeStampCreated).unix() - moment(b.timeStampCreated).unix(),
    },
    {
      key: '3',
      title: 'Title',
      dataIndex: 'title',
      textWrap: 'wrap',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      key: '4',
      title: 'Description',
      dataIndex: 'description',
      textWrap: 'wrap',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },

    {
      key: '5',
      title: 'Due Date',
      dataIndex: 'dueDate',
      sorter: (a, b) => moment(a.dueDate).unix() - moment(b.dueDate).unix(),
      render: (date) => moment(date).format('DD/MM/YY'),
    },

    {
      key: '6',
      title: 'Tags',
      dataIndex: 'tags',
      disable: true,
      filters: optionsTag,
      onFilter: (value, record) => record.tags.includes(value),

      render: (tags) => (
        <span>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'work') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag} className="my-tag">
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },

    {
      key: '7',
      title: 'Status',
      disable: true,
      dataIndex: 'status',
      filters: [
        { text: 'open', value: 'open' },
        { text: 'in progress', value: 'in progress' },
        { text: 'completed', value: 'completed' },
        { text: 'pending', value: 'pending' },
      ],
      onFilter: (value, record) => record.status.includes(value),
      render: (status) => {
        let color;
        switch (status) {
          case 'open':
            color = 'blue';
            break;
          case 'in progress':
            color = 'orange';
            break;
          case 'completed':
            color = 'green';
            break;
          case 'pending':
            color = 'red';
            break;
          default:
            color = 'blue';
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      required: true,
    },
    {
      key: '8',
      title: 'Actions',
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditStudent(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteStudent(record);
              }}
              style={{ color: 'red', marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const onAddTodoList = (e) => {
    setisForm(false);
    const randomNumber = parseInt(Math.random() * 1000);
    let newTodolist = {};
    const CurrentDate = moment().format('YYYY-MM-DD');
    console.log(title, description, dueDate, tags, states);

    if (title && description && states) {
      newTodolist = {
        id: randomNumber,
        timeStampCreated: CurrentDate,
        title: title,
        description: description,
        dueDate: dueDate,
        tags: tags,
        status: states,
      };
    }
    dispatch(addTodo(newTodolist));
  };
  const onDeleteStudent = (record) => {
    Modal.confirm({
      title: 'Are you sure, you want to delete this student record?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'cancel',
      onOk: () => {
        dispatch(deleteTodo(record));
      },
    });
  };
  const onEditStudent = (record) => {
    setIsEditing(true);
    setEditingStudent({ ...record });
  };
  const resetEditing = () => {
    setIsEditing(false);
    setEditingStudent(null);
  };

  const onSearch = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === '') {
      setfiltereData(dataSourcee);
      return;
    }
  };

  const globleSearch = () => {
    if (searchText === '') {
      return;
    }
    const filtereData = dataSourcee.filter((value) => {
      return (
        value.description.toLowerCase().includes(searchText.toLowerCase()) ||
        value.title.toLowerCase().includes(searchText.toLowerCase()) ||
        value.dueDate.toLowerCase().includes(searchText.toLowerCase()) ||
        value.status.toLowerCase().includes(searchText.toLowerCase()) ||
        value.tags.includes(searchText.toLowerCase())
      );
    });
    console.log(filtereData);
    setfiltereData(filtereData);
  };

  const disabledDate = (current) => {
    return current && current < dayjs().endOf('day');
  };

  return (
    <div className="App">
      {dataSourcee.length === 0 ? (
        <Spin size="large" tip="Loading..." style={{ color: 'white' }} />
      ) : (
        <>
          <header className="App-header">
            <h1 style={{ color: '#0000007d' }}>ToDo List</h1>
            <Space>
              <Button
                onClick={() => {
                  setisForm(true);
                }}
              >
                Add a Data Todo List
              </Button>
              <br />
              <br />
              <br />

              <Space>
                <Input
                  placeholder="input search text"
                  allowClear
                  onChange={onSearch}
                  value={searchText}
                  style={{
                    width: 200,
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      globleSearch();
                    }
                  }}
                />
                <Button onClick={globleSearch}>Search</Button>
              </Space>
            </Space>
            <br />

            <ProTable
              search={false}
              columns={columns}
              dataSource={filtereData}
              pagination={{
                pageSize: 5,

                onChange: (page) => console.log(page),
              }}
              editable={{
                type: 'multiple',
              }}
              options={false}
              style={{ width: '1250px' }}
              headerTitle="TodoList"
            ></ProTable>
            <Modal
              title="Edit Student"
              visible={isEditing}
              okText="Save"
              cancelText="cancel"
              onCancel={() => {
                resetEditing();
              }}
              onOk={() => {
                dispatch(updateTodo(editingStudent));
                resetEditing();
              }}
            >
              <span>TimeStamp</span>
              <br />
              <DatePicker
                value={dayjs(editingStudent?.timeStampCreated, 'YYYY-MM-DD')}
                format={'YYYY-MM-DD'}
                disabled
                onChange={(date, dateString) => {
                  setEditingStudent((pre) => {
                    return { ...pre, timeStampCreated: dateString };
                  });
                }}
              />
              <br />
              <span>Title</span>
              <Input
                value={editingStudent?.title}
                onChange={(e) => {
                  setEditingStudent((pre) => {
                    return { ...pre, title: e.target.value };
                  });
                }}
                maxLength={100}
                showCount
              />
              <span>Description</span>
              <TextArea
                value={editingStudent?.description}
                onChange={(e) => {
                  setEditingStudent((pre) => {
                    return { ...pre, description: e.target.value };
                  });
                }}
                maxLength={1000}
                showCount
              />

              <br />
              <span>Due Date</span>
              <DatePicker
                value={dayjs(editingStudent?.dueDate, 'YYYY-MM-DD')}
                format={'YYYY-MM-DD'}
                onChange={(date, dateString) => {
                  setEditingStudent((pre) => {
                    return { ...pre, dueDate: dateString };
                  });
                }}
                disabledDate={disabledDate}
              />
              <span>Status</span>
              <Select
                defaultValue="open"
                style={{
                  width: 120,
                }}
                value={editingStudent?.status}
                onChange={(value) => {
                  setEditingStudent((pre) => {
                    return { ...pre, status: value };
                  });
                }}
                options={[
                  {
                    value: 'open',
                    label: 'open',
                  },
                  {
                    value: 'in progress',
                    label: 'in progress',
                  },
                  {
                    value: 'completed',
                    label: 'completed',
                  },
                  {
                    value: 'pending',
                    label: 'pending',
                  },
                ]}
              />

              <br />
              <br />
              <Tags
                addTags={setTags}
                isEditable={true}
                value={editingStudent?.tags}
                placeholder="Please select"
                setUpdateTodoList={setEditingStudent}
              />
            </Modal>

            <Modal
              title="Add todo list"
              visible={isForm}
              onCancel={() => {
                setisForm(false);
              }}
              footer={null}
            >
              <Form onFinish={onAddTodoList}>
                <span>TimeStamp</span>
                <br />
                <DatePicker
                  defaultValue={moment()}
                  format={'YYYY-MM-DD'}
                  disabled
                />
                <br />
                <span>Title</span>
                <Input
                  value={editingStudent?.title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  required
                  maxLength={100}
                  showCount
                />
                <span>Description</span>
                <TextArea
                  value={editingStudent?.description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  required
                  maxLength={1000}
                  showCount
                />
                <br />
                <Space>
                  <span>Due Date</span>
                  <DatePicker
                    onChange={(date, dateString) => {
                      setDueDate(dateString);
                    }}
                    disabledDate={disabledDate}
                  />

                  <span>Status</span>

                  <Select
                    defaultValue="open"
                    style={{
                      width: 120,
                    }}
                    onChange={(value) => {
                      setStates(value);
                    }}
                    options={[
                      {
                        value: 'open',
                        label: 'open',
                      },
                      {
                        value: 'in progress',
                        label: 'in progress',
                      },
                      {
                        value: 'completed',
                        label: 'completed',
                      },
                      {
                        value: 'pending',
                        label: 'pending',
                      },
                    ]}
                  />
                </Space>
                <br />
                <br />
                <Tags addTags={setTags} isEditable={false} />
                <br />
                <br />
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form>
            </Modal>
          </header>
        </>
      )}
    </div>
  );
}

export default App;
