// src/components/SearchForm/SearchForm.js
import React, { useState } from 'react';
import { Form, Input, Button, Radio, Spin, Popover, DatePicker } from 'antd';
import { InlineEdit, InputPicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

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

const requiresActDetails = [
  'legge',
  'decreto legge',
  'decreto legislativo',
  'regolamento ue',
  'direttiva ue',
];

const SearchForm = ({ onSearch }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [versionDate, setVersionDate] = useState(null);

  const handleVersionChange = (e) => {
    const newVersion = e.target.value;
    form.setFieldsValue({ version: newVersion });
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const data = {
      act_type: values.act_type,
      act_number: requiresActDetails.includes(values.act_type) ? values.act_number : undefined,
      date: values.date || undefined,
      article: values.article,
      version: values.version,
      version_date: values.version === 'vigente' ? versionDate : undefined,
      annex: values.annex || undefined,
    };
    await onSearch(data);
    setLoading(false);
  };

  const ActTypeInlineEdit = () => {
    const actTypeValue = form.getFieldValue('act_type') || null;
    const handleChange = (value) => form.setFieldsValue({ act_type: value });

    return (
      <InlineEdit
        placement="right"
        trigger="click"
        defaultValue={actTypeValue}
        onChange={handleChange}
        showControls={false}
        style={{
          display: 'block',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          padding: '4px 11px',
          minHeight: '32px',
          lineHeight: '32px',
          cursor: 'pointer',
          backgroundColor: '#fff',
        }}
      >
        <InputPicker
          data={actTypeData}
          style={{
            width: '100%',
            height: '32px',
            border: 'none',
            boxShadow: 'none',
            padding: '0',
            margin: '0',
            fontSize: '14px',
          }}
          value={actTypeValue}
          onChange={handleChange}
          placeholder="Seleziona un tipo di atto"
        />
      </InlineEdit>
    );
  };

  const VersionDatePopover = () => (
    <DatePicker
      value={versionDate}
      onChange={(date) => setVersionDate(date)}
      defaultValue={new Date()}
      style={{ width: '100%' }}
      placeholder="Seleziona la data versione"
    />
  );

  return (
    <Spin spinning={loading} tip="Caricamento...">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          version: 'originale',
        }}
        style={{ maxWidth: 600, margin: '0 auto' }}
      >
        <Form.Item
          name="act_type"
          label="Tipo Atto"
          rules={[{ required: true, message: 'Seleziona un tipo di atto!' }]}
        >
          <ActTypeInlineEdit />
        </Form.Item>

        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.act_type !== currentValues.act_type}>
          {({ getFieldValue }) =>
            requiresActDetails.includes(getFieldValue('act_type')) ? (
              <Form.Item name="act_number" label="Numero Atto">
                <Input placeholder="Numero Atto" />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.act_type !== currentValues.act_type}>
          {({ getFieldValue }) =>
            requiresActDetails.includes(getFieldValue('act_type')) ? (
              <Form.Item name="date" label="Data Atto (Anno o gg/mm/aaaa)">
                <Input placeholder="aaaa o gg/mm/aaaa" />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        <Form.Item label="Articolo e Allegato">
          <Input.Group compact>
            <Form.Item
              name="article"
              rules={[{ required: true, message: 'Inserisci l\'articolo!' }]}
              noStyle
            >
              <Input style={{ width: 'calc(100% - 5em)' }} placeholder="Es. 1, 3-5" />
            </Form.Item>
            <Form.Item name="annex" noStyle>
              <Input style={{ width: '5em' }} placeholder="All." />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item name="version" label="Versione">
          <Radio.Group onChange={handleVersionChange}>
            <Radio value="originale">Originale</Radio>
            <Popover
              content={<VersionDatePopover />}
              trigger="click"
              placement="bottom"
            >
              <Radio value="vigente">Vigente</Radio>
            </Popover>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cerca
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default SearchForm;
