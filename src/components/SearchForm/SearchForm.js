// src/components/SearchForm/SearchForm.js
import React, { useState, useEffect } from 'react';
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
import { useWatch } from 'antd/es/form/Form';
import { CalendarOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;

// Dati per il tipo di atto
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

// Tipi di atto che richiedono campi aggiuntivi
const requiresActDetails = [
  'legge',
  'decreto legge',
  'decreto legislativo',
  'regolamento ue',
  'direttiva ue',
];

const SearchForm = ({ onSearch }) => {
  const [form] = Form.useForm(); // Creazione dell'istanza del form
  const [loading, setLoading] = useState(false);
  const [versionDate, setVersionDate] = useState(moment());

  // Monitorare il campo 'version'
  const version = useWatch('version', form);

  // Monitorare il campo 'version_date'
  const selectedVersionDate = useWatch('version_date', form);

  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  useEffect(() => {
    if (version === 'vigente') {
      setIsPopoverVisible(true);
    } else {
      setIsPopoverVisible(false);
    }
  }, [version]);

  // Recupera i dati salvati da localStorage al montaggio
  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem('searchFormData'));
    if (savedFormData) {
      // Converti le stringhe di data in oggetti moment
      if (savedFormData.version_date) {
        savedFormData.version_date = moment(savedFormData.version_date, 'YYYY-MM-DD');
      }
      form.setFieldsValue(savedFormData);
    }
  }, [form]);

  // Salva i dati del form in localStorage ogni volta che cambiano
  const handleFormChange = (_, allValues) => {
    const dataToSave = { ...allValues };
    if (dataToSave.version_date) {
      dataToSave.version_date = dataToSave.version_date.format('YYYY-MM-DD');
    }
    localStorage.setItem('searchFormData', JSON.stringify(dataToSave));
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const data = {
      act_type: values.act_type,
      act_number: requiresActDetails.includes(values.act_type)
        ? values.act_number
        : undefined,
      date: values.date || undefined,
      article: values.article,
      version: values.version,
      version_date:
        values.version === 'vigente'
          ? values.version_date
            ? values.version_date.format('YYYY-MM-DD')
            : undefined
          : undefined,
      annex: values.annex || undefined,
    };
    await onSearch(data);
    setLoading(false);
  };

  const handleDateChange = (date) => {
    setVersionDate(date);
    form.setFieldsValue({ version_date: date });
    setIsPopoverVisible(false);
  };

  const VersionDateContent = (
    <DatePicker
      value={versionDate}
      onChange={handleDateChange}
      style={{ width: '100%' }}
      placeholder="Seleziona la data versione"
      format="YYYY-MM-DD"
    />
  );

  return (
    <Spin spinning={loading} tip="Caricamento...">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleFormChange}
        initialValues={{
          version: 'vigente',
          version_date: moment(),
        }}
        style={{ maxWidth: 600, margin: '0 auto', marginBottom: '2em' }}
      >
        {/* Tipo Atto: Select Scrollabile */}
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

        {/* Campi Condizionali: Numero Atto e Data Atto */}
        <Form.Item
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.act_type !== currentValues.act_type
          }
          noStyle
        >
          {({ getFieldValue }) =>
            requiresActDetails.includes(getFieldValue('act_type')) ? (
              <>
                <Form.Item
                  name="act_number"
                  label="Numero Atto"
                  rules={[
                    { required: true, message: "Inserisci il numero dell'atto!" },
                    {
                      pattern: /^[0-9]+$/,
                      message: 'Il numero atto deve essere numerico!',
                    },
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
                      validator: (_, value) => {
                        if (
                          !value ||
                          moment(value, ['YYYY', 'DD/MM/YYYY'], true).isValid()
                        ) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('Inserisci una data valida (aaaa o gg/mm/aaaa)!')
                        );
                      },
                    },
                  ]}
                >
                  <Input placeholder="aaaa o gg/mm/aaaa" />
                </Form.Item>
              </>
            ) : null
          }
        </Form.Item>

        {/* Articolo e Allegato */}
        <Form.Item label="Articolo e Allegato">
          <Space.Compact style={{ width: '100%' }}>
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
          </Space.Compact>
        </Form.Item>

        {/* Versione */}
        <Form.Item name="version" label="Versione">
          <Radio.Group>
            <Radio value="originale">Originale</Radio>
            <Radio value="vigente">
              <span style={{ display: 'flex', alignItems: 'center' }}>
                Vigente
                {/* Icona calendario per aprire il Popover */}
                <Popover
                  content={VersionDateContent}
                  trigger="click"
                  placement="right"
                  overlayStyle={{ zIndex: 2000 }}
                  open={isPopoverVisible}
                  onOpenChange={(visible) => setIsPopoverVisible(visible)}
                >
                  <CalendarOutlined style={{ marginLeft: '8px', cursor: 'pointer' }} aria-label="Seleziona Data Versione" />
                </Popover>
              </span>
            </Radio>
          </Radio.Group>
        </Form.Item>

        {/* Messaggio per la Data Versione Modificata */}
        {version === 'vigente' &&
          selectedVersionDate &&
          selectedVersionDate.isValid() &&
          selectedVersionDate.format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD') && (
            <Form.Item noStyle>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Data versione modificata: {selectedVersionDate.format('YYYY-MM-DD')}
              </Text>
            </Form.Item>
          )}

        {/* Pulsante Cerca */}
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
