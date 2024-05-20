import Queue from 'bull';

interface EmailJobData {
    to: string;
    subject: string;
    body: string;
}

class EmailQueue {
    private queue: any;

    constructor(queueName: string) {
        this.queue = new Queue(queueName, {
            redis: {
                host: 'localhost',
                port: 6379, // Redis server port
            },
        });

        this.queue.process(this.processJob.bind(this));
    }

    private async processJob(job: Queue.Job<EmailJobData>) {
        const { to, subject, body } = job.data;

        // Simulate sending an email
        console.log(`Sending email to: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);

        // Simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log('Email sent successfully');
    }

    async addEmailJob(data: EmailJobData) {
        await this.queue.add(data);
    }
}

export default EmailQueue;
