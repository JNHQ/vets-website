import {
  isValidFileSize,
  isValidFileType,
  isValidFile,
  isValidDocument,
} from '../../utils/validations';

describe('Claims status validation:', () => {
  describe('isValidFileSize', () => {
    test('should validate size is less than max', () => {
      const result = isValidFileSize({ size: 10 });
      expect(result).toBe(true);
    });
  });
  describe('isValidFileType', () => {
    test('should check that file has a valid type', () => {
      const result = isValidFileType({
        name: 'testing.jpg',
      });

      expect(result).toBe(true);
    });
    test('should check that file has an invalid type', () => {
      const result = isValidFileType({
        name: 'testing.exe',
      });

      expect(result).toBe(false);
    });
    test('should check that file has a valid type regardless of case', () => {
      const result = isValidFileType({
        name: 'testing.JPG',
      });

      expect(result).toBe(true);
    });
  });
  describe('isValidFile', () => {
    test('should validate file for size and type', () => {
      const result = isValidFile({
        name: 'testing.jpg',
        size: 10,
      });

      expect(result).toBe(true);
    });
    test('should not validate empty file', () => {
      const result = isValidFile();

      expect(result).toBe(false);
    });
  });
  describe('isValidDocument', () => {
    test('should validate that docType is not blank', () => {
      const result = isValidDocument({
        file: {
          name: 'test.jpg',
          size: 10,
        },
        docType: {
          value: '',
        },
      });

      expect(result).toBe(false);
    });
    test('should validate that docType and file are valid', () => {
      const result = isValidDocument({
        file: {
          name: 'test.jpg',
          size: 10,
        },
        docType: {
          value: 'L101',
        },
      });

      expect(result).toBe(true);
    });
  });
});
