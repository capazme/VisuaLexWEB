import React, { useState, useEffect, useMemo } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Spin,
  Popover,
  DatePicker,
  Space,
  Radio,
  Typography,
} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import { CalendarOutlined } from '@ant-design/icons';
import './SearchForm.styles.css'; // Ensure this file exists or remove the import

const { Option } = Select;
const { Text } = Typography;

const actTypeData = [
  { label: 'Legge', value: 'legge' },
  { label: 'Decreto Legge', value: 'decreto legge' },
  { label: 'Decreto Legislativo', value: 'decreto legislativo' },
  { label: 'Regolamento UE', value: 'regolamento ue' },
  { label: 'Direttiva UE', value: 'direttiva ue' },
  { label: 'Costituzione', value: 'costituzione' },
  { label: 'Codice di Procedura Penale', value: 'codice di procedura penale' },
  { label: 'CDFUE', value: 'cdfue' },
];

const SearchForm = ({ onSearch }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  // Memoized list of act types that require additional fields
  const requiresActDetails = useMemo(
    () => ['legge', 'decreto legge', 'decreto legislativo', 'regolamento ue', 'direttiva ue'],
    []
  );

  const initialValues = {
    version: 'vigente',
    version_date: moment(),
  };

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem('searchFormData'));
    if (savedFormData) {
      if (savedFormData.version_date) {
        savedFormData.version_date = moment(savedFormData.version_date, 'YYYY-MM-DD');
      }
      form.setFieldsValue(savedFormData);
    }
  }, [form]);

  // Save form data to localStorage on change
  const handleFormChange = (_, allValues) => {
    const dataToSave = { ...allValues };
    if (dataToSave.version_date) {
      dataToSave.version_date = dataToSave.version_date.format('YYYY-MM-DD');
    }
    localStorage.setItem('searchFormData', JSON.stringify(dataToSave));
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const payload = {
      act_type: values.act_type,
      act_number: requiresActDetails.includes(values.act_type) ? values.act_number : undefined,
      date: values.date || undefined,
      article: values.article,
      version: values.version,
      version_date: values.version === 'vigente' ? values.version_date?.format('YYYY-MM-DD') : undefined,
      annex: values.annex || undefined,
    };
    await onSearch(payload);
    setLoading(false);
  };

  return (
    <Spin spinning={loading} tip="Caricamento...">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleFormChange}
        initialValues={initialValues}
        style={{ maxWidth: 600, margin: '0 auto', marginBottom: '2em' }}
      >
        {/* Act Type Field */}
        <Form.Item
          name="act_type"
          label="Tipo Atto"
          rules={[{ required: true, message: 'Seleziona un tipo di atto!' }]}
        >
          <Select
            showSearch
            placeholder="Seleziona un tipo di atto"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            dropdownStyle={{ maxHeight: 200, overflowY: 'auto' }}
          >
            {actTypeData.map((type) => (
              <Option key={type.value} value={type.value}>
                {type.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Conditional Fields */}
        {requiresActDetails.includes(form.getFieldValue('act_type')) && (
          <>
            <Form.Item
              name="act_number"
              label="Numero Atto"
              rules={[
                { required: true, message: "Inserisci il numero dell'atto!" },
                { pattern: /^[0-9]+$/, message: 'Il numero atto deve essere numerico!' },
              ]}
            >
              <Input placeholder="Numero Atto" />
            </Form.Item>

            <Form.Item
              name="date"
              label="Data Atto (Anno o gg/mm/aaaa)"
              rules={[
                { required: true, message: "Inserisci la data dell'atto!" },
                {
                  validator: (_, value) =>
                    !value || moment(value, ['YYYY', 'DD/MM/YYYY'], true).isValid()
                      ? Promise.resolve()
                      : Promise.reject(new Error('Inserisci una data valida (aaaa o gg/mm/aaaa)!')),
                },
              ]}
            >
              <Input placeholder="aaaa o gg/mm/aaaa" />
            </Form.Item>
          </>
        )}

        {/* Article and Annex */}
        <Form.Item label="Articolo e Allegato">
          <Space style={{ width: '100%' }}>
            <Form.Item
              name="article"
              rules={[
                { required: true, message: "Inserisci l'articolo!" },
                {
                  pattern: /^(\d+)(-\d+)?(,\s*\d+(-\d+)?)*/,
                  message: 'Formato articolo non valido (es. 1, 3-5)',
                },
              ]}
              noStyle
            >
              <Input style={{ width: 'calc(100% - 5em)' }} placeholder="Es. 1, 3-5" />
            </Form.Item>
            <Form.Item name="annex" noStyle>
              <Input style={{ width: '5em' }} placeholder="All." />
            </Form.Item>
          </Space>
        </Form.Item>

        {/* Version Field */}
        <Form.Item name="version" label="Versione">
          <Radio.Group>
            <Radio value="originale">Originale</Radio>
            <Radio value="vigente">
              <span style={{ display: 'flex', alignItems: 'center' }}>
                Vigente
                <Popover
                  content={
                    <DatePicker
                      value={form.getFieldValue('version_date')}
                      onChange={(date) => form.setFieldsValue({ version_date: date })}
                      style={{ width: '100%' }}
                      placeholder="Seleziona la data versione"
                      format="YYYY-MM-DD"
                    />
                  }
                  trigger="click"
                  placement="right"
                  open={isPopoverVisible}
                  onOpenChange={setIsPopoverVisible}
                >
                  <CalendarOutlined
                    style={{ marginLeft: '8px', cursor: 'pointer' }}
                    aria-label="Seleziona Data Versione"
                  />
                </Popover>
              </span>
            </Radio>
          </Radio.Group>
        </Form.Item>

        {/* Feedback on Version Date */}
        {form.getFieldValue('version') === 'vigente' && form.getFieldValue('version_date') && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Data versione: {form.getFieldValue('version_date').format('YYYY-MM-DD')}
          </Text>
        )}

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Cerca
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

SearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchForm;
