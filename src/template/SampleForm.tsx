import { Button, Group, NumberInput, TextInput } from '@mantine/core';
import { hasLength, isEmail, isInRange, isNotEmpty, matches } from '@mantine/form';
import { createFormContext } from '@mantine/form';

// Definition of form values is required
type formProps = {
  name: string;
  job: string;
  email: string;
  favoriteColor: string;
  age: number;
};

// createFormContext returns a tuple with 3 items:
// FormProvider is a component that sets form context
// useFormContext hook return form object that was previously set in FormProvider
// useForm hook works the same way as useForm exported from the package but has predefined type
const [FormProvider, useFormContext, useForm] = createFormContext<formProps>();

function NameField() {
  const form = useFormContext();
  return <TextInput label='名前' placeholder='山田太郎' withAsterisk {...form.getInputProps('name')} />;
}

export function SampleForm() {
  // Create form as described in use-form documentation
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      name: '',
      job: '',
      email: '',
      favoriteColor: '',
      age: 18
    },

    validate: {
      name: hasLength({ min: 2, max: 10 }, '名前は2〜10文字で入力してください'),
      job: isNotEmpty('現在の職業を入力してください'),
      email: isEmail('有効なメールアドレスを入力してください'),
      favoriteColor: matches(/^#([0-9a-f]{3}){1,2}$/, '有効な16進数カラーコードを入力してください'),
      age: isInRange({ min: 18, max: 99 }, '登録するには18〜99歳である必要があります')
    }
  });

  function handleSubmit(): void {
    console.log(form.values.name);
  }

  return (
    // Wrap your form with FormProvider
    <FormProvider form={form}>
      <form
        onSubmit={form.onSubmit(() => {
          handleSubmit();
        })}
      >
        <NameField />
        <TextInput label='職業' placeholder='あなたの職業' withAsterisk mt='md' {...form.getInputProps('job')} />
        <TextInput
          label='メールアドレス'
          placeholder='あなたのメールアドレス'
          withAsterisk
          mt='md'
          {...form.getInputProps('email')}
        />
        <TextInput
          label='好きな色'
          placeholder='あなたの好きな色'
          withAsterisk
          mt='md'
          {...form.getInputProps('favoriteColor')}
        />
        <NumberInput label='年齢' placeholder='あなたの年齢' withAsterisk mt='md' {...form.getInputProps('age')} />

        <Group justify='flex-end' mt='md'>
          <Button type='submit'>送信</Button>
          <Button onClick={() => form.reset()}>初期値に戻す</Button>
        </Group>
      </form>
    </FormProvider>
  );
}
